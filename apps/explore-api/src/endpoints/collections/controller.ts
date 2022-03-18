import { Response, Request } from 'express';
import * as service from './service';
import { CollectionQueryParams } from './types';

export async function create(req: Request, res: Response) {
  res.json({
    data: await service.save(req.body),
  });
}

export async function search(req: Request, res: Response) {
  const [data, pagination] = await service.search(
    req.query as unknown as CollectionQueryParams
  );
  res.json({
    data,
    pagination,
  });
}

export async function findById(req: Request, res: Response) {
  const collectionId = req.params.collectionId as string;
  const data = await service.findById(collectionId);
  res.json({ data });
}

export async function deleteById(req: Request, res: Response) {
  const collectionId = req.params.collectionId as string;
  await service.deleteById(collectionId);
  res.json({
    data: collectionId,
  });
}

export async function update(req: Request, res: Response) {
  res.json({
    data: await service.update(req.body),
  });
}
