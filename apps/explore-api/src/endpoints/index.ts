import compose from 'koa-compose';

import contractRouter from './contracts/router';

export default compose([contractRouter]);
