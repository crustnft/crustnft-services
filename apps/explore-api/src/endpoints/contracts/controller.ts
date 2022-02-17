import { Context } from 'koa';
import * as service from './service';

export async function create(ctx: Context) {
  ctx.body = {
    data: await service.save(ctx.request.body),
  };
}

export async function search(ctx: Context) {
  const { pageSize = 10, pageCursor } = ctx.query;
  const [data, pagination] = await service.search(pageSize, pageCursor);
  ctx.body = {
    data,
    pagination,
  };
}

export async function findById(ctx: Context) {
  const data = await service.findById(ctx.params.txHash as string);
  ctx.body = {
    data,
  };
}
