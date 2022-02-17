import Joi from 'joi';
import { CreateContractDto } from './types';

export const CreateContractDtoSchema = Joi.object<CreateContractDto>({
  txHash: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]+$/),
  account: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]{40}$/),
  chainId: Joi.number().required().greater(0),
  contractAddress: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]{40}$/),
  contractContent: Joi.string().empty('').required(),
});

export const GetContractByTxHashSchema = Joi.object({
  txHash: Joi.string()
    .empty('')
    .required()
    .pattern(/^0x[a-fA-F0-9]+$/),
});

export const SearchContractSchema = Joi.object<
  Partial<CreateContractDto> & {
    pageSize: number;
    pageCursor: string;
  }
>({
  txHash: Joi.string()
    .empty('')
    .pattern(/^0x[a-fA-F0-9]+$/),
  account: Joi.string()
    .empty('')
    .pattern(/^0x[a-fA-F0-9]{40}$/),
  chainId: Joi.number().greater(0),
  pageSize: Joi.number().greater(0),
  contractAddress: Joi.string()
    .empty('')
    .pattern(/^0x[a-fA-F0-9]{40}$/),
});
