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
        if (error.statusCode === 400) {
          ctx.body = {
            error: {
              message: HttpError[400].name,
              details: error.details,
            },
          };
          return;
        }
        ctx.body = {
          error: {
            message: error.message,
            details: error.details,
          },
        };
        return;
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
