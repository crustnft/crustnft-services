import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

const { JWT_SECRET } = process.env;

export async function checkAuthentication(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    throw createHttpError(401, 'Missing authentication token');
  }
  const token = authHeader.split(' ').pop();
  const payload = await verifyToken(token);
  ctx.state.user = payload;
  await next();
}

function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, function (error, decoded) {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
