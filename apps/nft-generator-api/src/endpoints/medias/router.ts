import express from 'express';
import asyncHandler from 'express-async-handler';
import { createMedia } from './controller';
import { validateRequestBody } from '@crustnft-explore/util-config-api';
import { CreateMediaDtoSchema } from './schema';
import { checkAuthentication } from '../../middlewares/authentication';

const router = express.Router();

router.post(
  '/',
  checkAuthentication(),
  validateRequestBody(CreateMediaDtoSchema),
  asyncHandler(createMedia)
);

export default router;
