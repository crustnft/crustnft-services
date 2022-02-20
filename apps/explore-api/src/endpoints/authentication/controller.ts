import { Context } from 'koa';

import * as authenticationService from './service';

export async function challengeLogin(ctx: Context) {
  const data = await authenticationService.getUserNonce(
    ctx.request.body.account
  );
  ctx.body = {
    data,
  };
}

export async function login(ctx: Context) {
  const data = await authenticationService.login(ctx.request.body);
  ctx.body = {
    data,
  };
}
