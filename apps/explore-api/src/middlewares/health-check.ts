import { Context, Next } from 'koa';

export default function healthCheck() {
  return async (ctx: Context, next: Next) => {
    if (ctx.path === '/health') {
      ctx.body = {
        data: new Date().toISOString(),
      };
    }
    return next();
  };
}
