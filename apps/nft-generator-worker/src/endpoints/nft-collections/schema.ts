import Joi from 'joi';
import { NftCollectionWorkerDto } from '@crustnft-explore/data-access';

export const InitialNftGeneratorDtoSchema = Joi.object<NftCollectionWorkerDto>({
  id: Joi.string().required(),
  composingBatchSize: Joi.number().required(),
});
