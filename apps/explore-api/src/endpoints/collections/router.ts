import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  validateRequestQuery,
  checkAuthentication,
} from '@crustnft-explore/util-config-api';

import * as collectionController from './controller';
import { CreateCollectionDtoSchema } from './schema';

const router = express.Router();

router.post(
  '/',
  checkAuthentication(),
  validateRequestBody(CreateCollectionDtoSchema),
  asyncHandler(collectionController.create)
);

router.put(
  '/',
  checkAuthentication(),
  validateRequestBody(CreateCollectionDtoSchema),
  asyncHandler(collectionController.update)
);

router.get('/:collectionId', asyncHandler(collectionController.findById));

router.delete(
  '/:collectionId',
  checkAuthentication(),
  asyncHandler(collectionController.deleteById)
);

router.get(
  '/',
  validateRequestQuery(CreateCollectionDtoSchema),
  asyncHandler(collectionController.search)
);

export default router;
