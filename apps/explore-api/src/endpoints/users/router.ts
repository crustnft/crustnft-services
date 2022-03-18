import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  checkAuthentication,
} from '@crustnft-explore/util-config-api';

import * as userController from './controller';
import { CreateUserDtoSchema } from './schema';

const router = express.Router();

router.post(
  '/',
  validateRequestBody(CreateUserDtoSchema),
  asyncHandler(userController.create)
);
router.put(
  '/',
  checkAuthentication(),
  validateRequestBody(CreateUserDtoSchema),
  asyncHandler(userController.update)
);

router.get('/:accountAddress', asyncHandler(userController.findById));

router.get('/', asyncHandler(userController.search));

export default router;
