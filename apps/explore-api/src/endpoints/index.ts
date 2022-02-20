import compose from 'koa-compose';

import contractRouter from './contracts/router';
import collectionRouter from './collections/router';
import userRouter from './users/router';

export default compose([contractRouter, userRouter, collectionRouter]);
