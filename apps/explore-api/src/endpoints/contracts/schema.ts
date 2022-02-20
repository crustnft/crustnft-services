import Joi from 'joi';
import { ACCOUNT_REGEX } from '../../constants/regex';
import { ContractQueryParams, CreateContractDto } from './types';

export const CreateContractDtoSchema = Joi.object<CreateContractDto>({
  txHash: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]+$/),
  account: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
  chainId: Joi.number().required().greater(0),
  contractAddress: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
  contractContent: Joi.string().empty('').required(),
});

export const GetContractByTxHashSchema = Joi.object({
  txHash: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]+$/),
});

export const SearchContractSchema = Joi.object<ContractQueryParams>({
  txHash: Joi.string()
    .empty('')
    .pattern(/^0x[a-fA-F0-9]+$/),
  account: Joi.string().empty('').pattern(ACCOUNT_REGEX),
  chainId: Joi.number().greater(0),
  contractAddress: Joi.string().empty('').pattern(ACCOUNT_REGEX),
  pageSize: Joi.number().greater(0),
  pageCursor: Joi.optional(),
  order: Joi.optional(),
});
