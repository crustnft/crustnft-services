import Router from '@koa/router';
import { validateRequestBody } from '../../middlewares/validate-request';

import * as collectionController from './controller';
import { CreateCollectionDtoSchema } from './schema';

const router = new Router({ prefix: '/api/v1/collections' });

router.post(
  '/',
  validateRequestBody(CreateCollectionDtoSchema),
  collectionController.create
);
router.put(
  '/',
  validateRequestBody(CreateCollectionDtoSchema),
  collectionController.update
);

router.get('/:accountAddress', collectionController.findById);

router.get('/', collectionController.search);

export default router.routes();
