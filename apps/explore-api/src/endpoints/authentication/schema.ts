import Joi from 'joi';
import { ACCOUNT_REGEX } from '../../constants/regex';
import { ChallengeLoginDto, LoginDto } from './types';

export const ChallengeLoginDtoSchema = Joi.object<ChallengeLoginDto>({
  account: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
});

export const LoginDtoSchema = Joi.object<LoginDto>({
  signature: Joi.string().empty('').required(),
  account: Joi.string().empty('').required().pattern(ACCOUNT_REGEX),
});
