require('express-async-errors');

import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import MessagingService from '../api/services/messaging.service';
import SearchService from '../api/services/search.service';
import { corsMiddleware } from '../api/middleware/cors';

const app = express();

export default class ExpressServer {

  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(
      cors((req, callback) => {
        callback(null, {
          origin: true,
          credentials: true
        });
      }),
    );
    app.use(corsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));


    MessagingService.on('ready', () => {

      function getMessagePayload(message) {

        try {

          let response = JSON.parse(message.content.toString());
          return response.entities || [];
        } catch (e) {

          return [];
        }
      }

      async function handleMessage(ch, message, operationType) {

        try {
          
          let payload = getMessagePayload(message);
          switch (operationType) {

            case 'create':
              await SearchService.createEntities(payload);
              break;
            case 'update':
              await SearchService.updateEntities(payload);
              break;
            case 'delete':
              await SearchService.deleteEntities(payload);
              break;
          }
        } finally {

          ch.ack(message);
        }

      }

      MessagingService.subscribeToQueue('search.create', async (ch, message) => {

        await handleMessage(ch, message, 'create');
      });
      MessagingService.subscribeToQueue('search.update', async (ch, message) => {

        await handleMessage(ch, message, 'update');
      });
      MessagingService.subscribeToQueue('search.delete', async (ch, message) => {

        await handleMessage(ch, message, 'delete');
      });
    })
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  listen(port: number = parseInt(process.env.PORT)): Application {
    const welcome = port => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}