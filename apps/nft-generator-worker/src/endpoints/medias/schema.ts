import Joi from 'joi';
import { CreateMediaDto } from './types';

export const CreateMediaDtoSchema = Joi.object<CreateMediaDto>({
  fileName: Joi.string().required(),
  contentType: Joi.string().required(),
});
