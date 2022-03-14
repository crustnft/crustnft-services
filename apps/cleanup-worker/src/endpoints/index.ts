import { Application } from 'express';
import nftCollectionsRouter from './cleanup/router';

export default function registerRoutes(app: Application) {
  app.use('/api/v1/cleanup', nftCollectionsRouter);
}
