import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  validateRequestBody,
  checkAuthentication,
} from '@crustnft-explore/util-config-api';
import {
  CreateNftCollectionDtoSchema,
  GenerateNftCollectionDtoSchema,
  UpdateNftCollectionDtoSchema,
} from './schema';
import {
  create,
  update,
  findOne,
  searchCollection,
  listingCollection,
  generateNft,
} from './controller';

const router = express.Router();

router.use(checkAuthentication());

router.post(
  '/',
  validateRequestBody(CreateNftCollectionDtoSchema),
  asyncHandler(create)
);

router.put(
  '/',
  validateRequestBody(UpdateNftCollectionDtoSchema),
  asyncHandler(update)
);

router.post(
  '/generate-nft-collection',
  validateRequestBody(GenerateNftCollectionDtoSchema),
  asyncHandler(generateNft)
);

router.get('/listing', asyncHandler(listingCollection));

router.get('/:collectionId', asyncHandler(findOne));

router.get('/', asyncHandler(searchCollection));

export default router;
