import { Context, Next } from 'koa';
import HttpError from 'http-errors';

export function errorHandler() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      console.log('errorHandler: ', error);
      if (HttpError.isHttpError(error)) {
        ctx.status = error.statusCode;
        return (ctx.body = {
          error: {
            message: error.message,
          },
        });
      }
      ctx.status = 500;
      ctx.body = {
        error: {
          message: error.message,
        },
      };
    }
  };
}
