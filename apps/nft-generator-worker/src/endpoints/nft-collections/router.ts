import express from 'express';
import asyncHandler from 'express-async-handler';
import { validateRequestBody } from '@crustnft-explore/util-config-api';
import { InitialNftGeneratorDtoSchema } from './schema';
import { create, findOne } from './controller';
import { checkAuthentication } from '../../middlewares/authentication';

const router = express.Router();

router.post(
  '/',
  checkAuthentication(),
  validateRequestBody(InitialNftGeneratorDtoSchema),
  asyncHandler(create)
);

router.get('/:nftId', asyncHandler(findOne));

export default router;
