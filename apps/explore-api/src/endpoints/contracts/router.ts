import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams,
  checkAuthentication,
} from '@crustnft-explore/util-config-api';
import { create, search, findById, update } from './controller';
import {
  CreateContractDtoSchema,
  GetContractByTxHashSchema,
  SearchContractSchema,
  UpdateContractDtoSchema,
} from './schema';

const router = express.Router();

router.use(checkAuthentication());

router.post(
  '/',
  validateRequestBody(CreateContractDtoSchema),
  asyncHandler(create)
);

router.put(
  '/',
  validateRequestBody(UpdateContractDtoSchema),
  asyncHandler(update)
);

router.get(
  '/:txHash',
  validateRequestParams(GetContractByTxHashSchema),
  asyncHandler(findById)
);

router.get(
  '/',
  validateRequestQuery(SearchContractSchema),
  asyncHandler(search)
);

export default router;
