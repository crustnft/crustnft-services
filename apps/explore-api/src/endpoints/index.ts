import compose from 'koa-compose';

import authenticationRouter from './authentication/router';
import contractRouter from './contracts/router';
import collectionRouter from './collections/router';
import userRouter from './users/router';

export default compose([
  contractRouter,
  userRouter,
  collectionRouter,
  authenticationRouter,
]);
