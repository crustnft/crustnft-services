import Router from '@koa/router';
import { validateRequestBody } from '../../middlewares/validate-request';

import * as userController from './controller';
import { ChallengeLoginDtoSchema, LoginDtoSchema } from './schema';

const router = new Router({ prefix: '/api/v1/authentication' });

router.post(
  '/challenge-login',
  validateRequestBody(ChallengeLoginDtoSchema),
  userController.challengeLogin
);

router.post(
  '/login',
  validateRequestBody(LoginDtoSchema),
  userController.login
);

export default router.routes();
