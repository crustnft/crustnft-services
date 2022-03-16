import Joi from 'joi';
import {
  CreateNftCollectionDto,
  UpdateNftCollectionDto,
} from '@crustnft-explore/data-access';

export const CreateNftCollectionDtoSchema = Joi.object<CreateNftCollectionDto>({
  images: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .required(),
  layers: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        imageIds: Joi.array().items(Joi.string()).required(),
      })
    )
    .required(),
  layerOrder: Joi.array().items(Joi.string()).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

export const UpdateNftCollectionDtoSchema = Joi.object<UpdateNftCollectionDto>({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
});
