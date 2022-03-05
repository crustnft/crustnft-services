import Joi from 'joi';
import { CreateNftGeneratorDto } from '@crustnft-explore/data-access';

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
