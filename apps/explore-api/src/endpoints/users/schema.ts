import Joi from 'joi';
import { ACCOUNT_REGEX } from '../../constants/regex';
import { CreateUserDto } from './types';

export const CreateUserDtoSchema = Joi.object<CreateUserDto>({
  displayName: Joi.string().empty('').required(),
  account: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
  socialUrls: Joi.optional(),
  avatarCID: Joi.optional(),
  coverCID: Joi.optional(),
});
