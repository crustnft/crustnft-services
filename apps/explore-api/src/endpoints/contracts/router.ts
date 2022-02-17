import Router from '@koa/router';

import { create, search, findById } from './controller';

const router = new Router({ prefix: '/api/v1/contracts' });

router.post('/', create);
router.get('/', search);
router.get('/:txHash', findById);

export default router.routes();
