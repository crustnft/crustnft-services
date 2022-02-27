import supertest from 'supertest';
import * as http from 'http';
import Koa from 'koa';

export function createMockServer(app: Koa) {
  return supertest(http.createServer(app.callback()));
}
