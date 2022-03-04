import Joi from 'joi';
import { NftGeneratorDto } from './types';

export const InitialNftGeneratorDtoSchema = Joi.object<NftGeneratorDto>({
  id: Joi.string().required(),
});
