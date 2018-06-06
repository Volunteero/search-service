import { Application } from 'express';
import searchRouter from './api/controllers/search/router';
export default function routes(app: Application): void {
  app.use('/api/v1/search', searchRouter);
};