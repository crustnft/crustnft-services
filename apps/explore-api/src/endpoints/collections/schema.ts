import Joi from 'joi';
import { ACCOUNT_REGEX } from '../../constants/regex';
import { CollectionQueryParams, CreateCollectionDto } from './types';

export const CreateCollectionDtoSchema = Joi.object<CreateCollectionDto>({
  id: Joi.string()
    .empty('')
    .required()
    .pattern(
      /^[0-9]+-0x[a-fA-F0-9]{40}$/,
      'Collection ID format: `${chainId}-${address}`'
    ),
  account: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
  socialUrls: Joi.optional(),
  avatarCID: Joi.optional(),
  coverCID: Joi.optional(),
  description: Joi.optional(),
});

export const SearchCollectionSchema = Joi.object<CollectionQueryParams>({
  account: Joi.string().empty('').pattern(ACCOUNT_REGEX),
  pageSize: Joi.number().greater(0),
  order: Joi.optional(),
  pageCursor: Joi.optional(),
});
