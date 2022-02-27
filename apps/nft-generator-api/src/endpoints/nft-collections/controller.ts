import { Response, Request } from 'express';

import * as service from './service';

export async function create(req: Request, res: Response) {
  const initiatedCollection = await service.createNftGenerator(req.body);
  res.json({
    data: initiatedCollection,
  });
}

export async function findOne(req: Request, res: Response) {
  const { nftId } = req.params;
  const collection = await service.findOne(nftId);
  res.json({
    data: collection,
  });
}
