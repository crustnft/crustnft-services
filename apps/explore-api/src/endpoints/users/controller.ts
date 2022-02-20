import { Context } from 'koa';
import * as service from './service';
import { UserQueryParams } from './types';

export async function create(ctx: Context) {
  ctx.body = {
    data: await service.save(ctx.request.body),
  };
}

export async function update(ctx: Context) {
  ctx.body = {
    data: await service.update(ctx.request.body),
  };
}

export async function search(ctx: Context) {
  const [data, pagination] = await service.search(
    ctx.query as unknown as UserQueryParams
  );
  ctx.body = {
    data,
    pagination,
  };
}

export async function findById(ctx: Context) {
  const accountAddress = ctx.params.accountAddress as string;
  const [first] = await service.findById(accountAddress);
  ctx.body = {
    data: first,
  };
}
