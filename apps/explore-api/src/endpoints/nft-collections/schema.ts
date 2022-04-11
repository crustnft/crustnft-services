import Joi from 'joi';
import {
  CreateNftCollectionDto,
  NftCollectionWorkerDto,
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
  description: Joi.string().allow('').required(),
  txHash: Joi.string().optional(),
  whitelist: Joi.array().optional(),
});

export const UpdateNftCollectionDtoSchema = Joi.object<UpdateNftCollectionDto>({
  id: Joi.string().required(),
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
  description: Joi.string().allow('').required(),
  txHash: Joi.string().optional(),
  whitelist: Joi.array().optional(),
});

export const GenerateNftCollectionDtoSchema =
  Joi.object<NftCollectionWorkerDto>({
    id: Joi.string().required(),
    composingBatchSize: Joi.number().optional().min(1).max(20),
    collectionSize: Joi.number()
      .optional()
      .min(
        Joi.ref('composingBatchSize', {
          adjust: (value) => value * 2,
        })
      )
      .messages({
        'number.min':
          'collectionSize must be greater than 2x of composingBatchSize',
      }),
  });
