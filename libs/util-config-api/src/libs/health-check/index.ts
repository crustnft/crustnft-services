import { Request, Response, NextFunction } from 'express';

interface Options {
  path?: string;
}

export const healthCheck = function (options?: Options) {
  return function (req: Request, res: Response, next: NextFunction) {
    const path = options?.path || '/health';
    if (req.path === path) {
      return res.json({
        data: new Date().toISOString(),
      });
    }
    next();
  };
};
