import jwt from 'express-jwt';

const { JWT_SECRET } = process.env;

export function checkAuthentication() {
  return jwt({ secret: JWT_SECRET, algorithms: ['HS256'] });
}
