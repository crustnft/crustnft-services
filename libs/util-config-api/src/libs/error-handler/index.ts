import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { Logger } from '../logger';

const logger = Logger('errorHandler');

export function errorHandler() {
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (!error) {
      return next();
    }
    logger.error({ err: error }, `errorHandler - ${error.message}`);
    if (HttpError.isHttpError(error)) {
      const httpError = error as HttpError;
      res.status(httpError.statusCode);
      return res.json({
        error: {
          message: httpError.message,
          details: httpError.details,
        },
      });
    }
    res.status((error as any).status || 500);
    return res.json({
      error: {
        message: error.message,
      },
    });
  };
}
