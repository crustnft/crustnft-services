import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams,
  checkAuthentication,
} from '@crustnft-explore/util-config-api';
import { create, search, findById, update, listing } from './controller';
import {
  CreateContractDtoSchema,
  GetContractByTxHashSchema,
  SearchContractSchema,
  UpdateContractDtoSchema,
} from './schema';

const router = express.Router();

router.post(
  '/',
  checkAuthentication(),
  validateRequestBody(CreateContractDtoSchema),
  asyncHandler(create)
);

router.put(
  '/',
  checkAuthentication(),
  validateRequestBody(UpdateContractDtoSchema),
  asyncHandler(update)
);

router.get(
  '/listing',
  validateRequestQuery(SearchContractSchema),
  asyncHandler(listing)
);

router.get(
  '/:txHash',
  validateRequestParams(GetContractByTxHashSchema),
  asyncHandler(findById)
);

router.get(
  '/',
  checkAuthentication(),
  validateRequestQuery(SearchContractSchema),
  asyncHandler(search)
);

export default router;
