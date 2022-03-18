import { Response, Request } from 'express';
import * as service from './service';
import { UserQueryParams, UserSession } from '@crustnft-explore/data-access';

export async function create(req: Request, res: Response) {
  res.json({
    data: await service.save(req.body),
  });
}

export async function update(req: Request, res: Response) {
  const currentUser = req.user as UserSession;
  res.json({
    data: await service.update(req.body, currentUser),
  });
}

export async function search(req: Request, res: Response) {
  const [data, pagination] = await service.search(
    req.query as unknown as UserQueryParams
  );
  res.json({
    data,
    pagination,
  });
}

export async function findById(req: Request, res: Response) {
  const accountAddress = req.params.accountAddress as string;
  const user = await service.findById(accountAddress);
  res.json({
    data: user,
  });
}
