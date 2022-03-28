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

  const existingContract = await service.findById(updateBody.id);
  if (existingContract.creator !== currentUser.account) {
    throw new createHttpError[403]();
  }

  res.json({
    data: await service.update(updateBody, existingContract),
  });
}

export async function listing(req: Request, res: Response) {
  const queryRaw = req.query as unknown as ContractQueryParams;
  const query = { ...queryRaw, published: true };

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

export async function search(req: Request, res: Response) {
  const currentUser = req.user as UserSession;
  const queryRaw = req.query as unknown as ContractQueryParams;
  const query = { ...queryRaw, creator: currentUser.account };

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
  const contractId = req.params.id as string;
  const data = await service.findById(contractId);
  res.json({ data });
}
