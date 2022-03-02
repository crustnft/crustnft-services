import Joi from 'joi';
import { CreateNftGeneratorDto } from './types';

export const InitialNftGeneratorDtoSchema = Joi.object<CreateNftGeneratorDto>({
  medias: Joi.array()
    .items(
      Joi.object({
        category: Joi.string().required(),
        mediaId: Joi.string().required(),
      })
    )
    .required(),
});
