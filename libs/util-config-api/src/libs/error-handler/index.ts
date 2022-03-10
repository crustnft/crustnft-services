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
      res.status(error.statusCode);
      return res.json({
        error: {
          message: error.message,
          details: error.details,
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
