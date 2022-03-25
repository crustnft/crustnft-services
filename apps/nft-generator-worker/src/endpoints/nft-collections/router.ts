import express from 'express';
import asyncHandler from 'express-async-handler';
import { validateRequestBody } from '@crustnft-explore/util-config-api';
import { GenerateNftCollectionDtoSchema } from './schema';
import { create } from './controller';

const router = express.Router();

router.post(
  '/',
  validateRequestBody(GenerateNftCollectionDtoSchema),
  asyncHandler(create)
);

export default router;
