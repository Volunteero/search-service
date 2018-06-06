import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import MessagingService from '../api/services/messaging.service';
import SearchService from '../api/services/search.service';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));

    MessagingService.on('ready', () => {

      function getMessagePayload(message) {

        return JSON.parse(message.content.toString());
      }
      MessagingService.subscribeToQueue('search.create', async (ch, message) => {

        let payload = getMessagePayload(message);
        await SearchService.createEntities(payload.entities);
        ch.ack(message);
      });
      MessagingService.subscribeToQueue('search.update', async (ch, message) => {

        let payload = getMessagePayload(message);
        await SearchService.updateEntities(payload.entities);
        ch.ack(message);
      });
      MessagingService.subscribeToQueue('search.delete', async (ch, message) => {

        let payload = getMessagePayload(message);
        await SearchService.deleteEntities(payload.entities);
        ch.ack(message);
      });
    })
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes)
    return this;
  }

  listen(port: number = parseInt(process.env.PORT)): Application {
    const welcome = port => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}