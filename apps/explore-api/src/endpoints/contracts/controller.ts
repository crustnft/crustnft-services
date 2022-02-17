import { Context } from 'koa';
import * as service from './service';
import { ContractQueryParams } from './types';

export async function create(ctx: Context) {
  ctx.body = {
    data: await service.save(ctx.request.body),
  };
}

export async function search(ctx: Context) {
  const [data, pagination] = await service.search(
    ctx.query as unknown as ContractQueryParams
  );
  ctx.body = {
    data,
    pagination,
  };
}

export async function findById(ctx: Context) {
  const txHash = ctx.params.txHash as string;
  const [first] = await service.findById(txHash);
  ctx.body = {
    data: first,
  };
}
