import { Request, Response, NextFunction } from 'express';
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
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    return next();
  };
};

export const validateRequestParams = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.params, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    return next();
  };
};

export const validateRequestQuery = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.query, {
      allowUnknown: false,
      abortEarly: false,
    });

    validate(result);

    return next();
  };
};
