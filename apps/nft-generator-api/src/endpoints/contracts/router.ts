import Router from '@koa/router';

import { create, search } from './controller';

const router = new Router({ prefix: '/api/v1/contracts' });

router.post('/', create);
router.get('/', search);

export default router.routes();
