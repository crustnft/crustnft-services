import { Application } from 'express';

import authenticationRouter from './authentication/router';
import contractRouter from './contracts/router';
import collectionRouter from './collections/router';
import userRouter from './users/router';
import nftCollectionRouter from './nft-collections/router';
import mediaRouter from './medias/router';

export default function registerRoutes(app: Application) {
  app.use('/api/v1/authentication', authenticationRouter);
  app.use('/api/v1/collections', collectionRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/contracts', contractRouter);
  app.use('/api/v1/ntf-collections', nftCollectionRouter);
  app.use('/api/v1/medias', mediaRouter);
}
