import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams,
} from '@crustnft-explore/util-config-api';
import { create, search, findById } from './controller';
import {
  CreateContractDtoSchema,
  GetContractByTxHashSchema,
  SearchContractSchema,
} from './schema';

const router = express.Router();

router.post(
  '/',
  validateRequestBody(CreateContractDtoSchema),
  asyncHandler(create)
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
