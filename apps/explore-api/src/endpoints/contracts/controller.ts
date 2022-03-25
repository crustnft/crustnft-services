import { Response, Request } from 'express';
import createHttpError from 'http-errors';
import {
  UserSession,
  ContractQueryParams,
  UpdateContractDto,
} from '@crustnft-explore/data-access';
import * as service from './service';

export async function create(req: Request, res: Response) {
  const currentUser = req.user as UserSession;
  res.json({
    data: await service.save({ ...req.body, creator: currentUser.account }),
  });
}

export async function update(req: Request, res: Response) {
  const currentUser = req.user as UserSession;
  const updateBody = req.body as UpdateContractDto;

  const existingContract = await service.findById(updateBody.txHash);
  if (existingContract.creator !== currentUser.account) {
    throw new createHttpError[403]();
  }

  res.json({
    data: await service.update(updateBody, existingContract),
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
