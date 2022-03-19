import { Response, Request } from 'express';
import * as service from './service';
import { ContractQueryParams } from './types';

export async function create(req: Request, res: Response) {
  res.json({
    data: await service.save(req.body),
  });
}

export async function search(req: Request, res: Response) {
  const query = req.query as unknown as ContractQueryParams;

  if (query.countOnly === 'true') {
    const [collections] = await service.search(query);
    res.json({
      data: collections.length,
    });
    return;
  }

  const [data, pagination] = await service.search(query);
  res.json({
    data,
    pagination,
  });
}

export async function findById(req: Request, res: Response) {
  const txHash = req.params.txHash as string;
  const data = await service.findById(txHash);
  res.json({ data });
}
