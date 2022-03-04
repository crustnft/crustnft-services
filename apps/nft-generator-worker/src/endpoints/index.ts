import { Application } from 'express';
import nftCollectionsRouter from './nft-collections/router';

export default function registerRoutes(app: Application) {
  app.use('/api/v1/ntf-collections', nftCollectionsRouter);
}
