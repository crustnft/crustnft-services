import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import * as http from 'http';

export function createMockServer(app: Express.Application) {
  return supertest(http.createServer(app));
}

export function generateToken() {
  return jwt.sign(
    {
      account: process.env.ACCOUNT,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
      issuer: process.env.JWT_ISSUER,
    }
  );
}
