import express from 'express';
import asyncHandler from 'express-async-handler';
import { validateRequestBody } from '@crustnft-explore/util-config-api';
import { InitialNftGeneratorDtoSchema } from './schema';
import { create } from './controller';

const router = express.Router();

router.post(
  '/',
  validateRequestBody(InitialNftGeneratorDtoSchema),
  asyncHandler(create)
);

export default router;
