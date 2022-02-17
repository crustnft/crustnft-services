import Router from '@koa/router';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../../middlewares/validate-request';

import { create, search, findById } from './controller';
import {
  CreateContractDtoSchema,
  GetContractByTxHashSchema,
  SearchContractSchema,
} from './schema';

const router = new Router({ prefix: '/api/v1/contracts' });

router.post('/', validateRequestBody(CreateContractDtoSchema), create);

router.get(
  '/:txHash',
  validateRequestParams(GetContractByTxHashSchema),
  findById
);

router.get('/', validateRequestQuery(SearchContractSchema), search);

export default router.routes();
