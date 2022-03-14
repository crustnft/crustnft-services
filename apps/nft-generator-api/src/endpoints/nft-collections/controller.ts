import { Response, Request } from 'express';
import { NftCollectionQueryParams } from '@crustnft-explore/data-access';

import * as service from './service';

export async function create(req: Request, res: Response) {
  const initiatedCollection = await service.createNftGenerator(
    req.body,
    req.user
  );

  res.json({
    data: initiatedCollection,
  });
}

export async function findOne(req: Request, res: Response) {
  const { collectionId } = req.params;
  const collection = await service.findOne(collectionId);

  res.json({
    data: collection,
  });
}

export async function update(req: Request, res: Response) {
  const data = await service.update(req.body, req.user);

  res.json({
    data,
  });
}

export async function searchCollection(req: Request, res: Response) {
  const [data, pagination] = await service.search(
    req.query as unknown as NftCollectionQueryParams
  );

  res.json({
    data,
    pagination,
  });
}
