import { Context, Next } from 'koa';
import Joi, { ValidationErrorItem } from 'joi';
import createHttpError, { BadRequest } from 'http-errors';

interface FieldError {
  message: string;
  path: Array<string | number>;
}

const validate = (result: Joi.ValidationResult) => {
  if (result.error) {
    throw createHttpError(400, BadRequest.name, {
      details: result.error.details.map(
        ({ message, path }: ValidationErrorItem) => {
          const err: FieldError = {
            message,
            path,
          };
          return err;
        }
      ),
    });
  }
};

export const validateRequestBody = (schema: Joi.Schema) => {
  return async (ctx: Context, next: Next) => {
    const result = schema.validate(ctx.request.body, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    await next();
  };
};

export const validateRequestParams = (schema: Joi.Schema) => {
  return async (ctx: Context, next: Next) => {
    const result = schema.validate(ctx.params, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    await next();
  };
};

export const validateRequestQuery = (schema: Joi.Schema) => {
  return async (ctx: Context, next: Next) => {
    const result = schema.validate(ctx.query, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    await next();
  };
};
