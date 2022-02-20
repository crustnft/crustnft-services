import Joi from 'joi';
import { ACCOUNT_REGEX } from '../../constants/regex';
import { CreateCollectionDto } from './types';

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
  avatarUrl: Joi.optional(),
  coverUrl: Joi.optional(),
  description: Joi.optional(),
});
