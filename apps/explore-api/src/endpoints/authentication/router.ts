import express from 'express';
import { validateRequestBody } from '@crustnft-explore/util-config-api';
import asyncHandler from 'express-async-handler';

import * as userController from './controller';
import { ChallengeLoginDtoSchema, LoginDtoSchema } from './schema';

const router = express.Router();

router.post(
  '/challenge-login',
  validateRequestBody(ChallengeLoginDtoSchema),
  asyncHandler(userController.challengeLogin)
);

router.post(
  '/login',
  validateRequestBody(LoginDtoSchema),
  asyncHandler(userController.login)
);

export default router;
