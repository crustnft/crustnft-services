import Router from '@koa/router';
import { checkAuthentication } from '../../middlewares/authentication';
import { validateRequestBody } from '../../middlewares/validate-request';

import * as userController from './controller';
import { CreateUserDtoSchema } from './schema';

const router = new Router({ prefix: '/api/v1/users' });

router.post(
  '/',
  validateRequestBody(CreateUserDtoSchema),
  userController.create
);
router.put(
  '/',
  checkAuthentication,
  validateRequestBody(CreateUserDtoSchema),
  userController.update
);

router.get('/:accountAddress', userController.findById);

router.get('/', userController.search);

export default router.routes();
