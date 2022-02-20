import { Context } from 'koa';
import * as service from './service';
import { CollectionQueryParams } from './types';

export async function create(ctx: Context) {
  ctx.body = {
    data: await service.save(ctx.request.body),
  };
}

export async function search(ctx: Context) {
  const [data, pagination] = await service.search(
    ctx.query as unknown as CollectionQueryParams
  );
  ctx.body = {
    data,
    pagination,
  };
}

export async function findById(ctx: Context) {
  const collectionId = ctx.params.collectionId as string;
  const data = await service.findById(collectionId);
  ctx.body = {
    data,
  };
}

export async function deleteById(ctx: Context) {
  const collectionId = ctx.params.collectionId as string;
  await service.deleteById(collectionId);
  ctx.body = {
    data: collectionId,
  };
}

export async function update(ctx: Context) {
  ctx.body = {
    data: await service.update(ctx.request.body),
  };
}
