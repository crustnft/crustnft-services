import Router from '@koa/router';
import { checkAuthentication } from '../../middlewares/authentication';
import { validateRequestBody } from '../../middlewares/validate-request';

import * as collectionController from './controller';
import { CreateCollectionDtoSchema } from './schema';

const router = new Router({ prefix: '/api/v1/collections' });

router.post(
  '/',
  checkAuthentication,
  validateRequestBody(CreateCollectionDtoSchema),
  collectionController.create
);

router.put(
  '/',
  checkAuthentication,
  validateRequestBody(CreateCollectionDtoSchema),
  collectionController.update
);

router.get('/:collectionId', collectionController.findById);

router.delete(
  '/:collectionId',
  checkAuthentication,
  collectionController.deleteById
);

router.get('/', collectionController.search);

export default router.routes();
