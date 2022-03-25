import Joi from 'joi';
import { NftCollectionWorkerDto } from '@crustnft-explore/data-access';

export const GenerateNftCollectionDtoSchema =
  Joi.object<NftCollectionWorkerDto>({
    id: Joi.string().required(),
    composingBatchSize: Joi.number().optional(),
    collectionSize: Joi.number().optional(),
  });
