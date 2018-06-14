import * as pino from 'pino';

const l = pino({
  name: process.env.APP_ID || 'SearchService',
  level: process.env.LOG_LEVEL || 'trace',
});

export default l;
