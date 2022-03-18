import { Response, Request } from 'express';

import * as authenticationService from './service';

export async function challengeLogin(req: Request, res: Response) {
  const data = await authenticationService.getUserNonce(req.body.account);
  res.json({ data });
}

export async function login(req: Request, res: Response) {
  const data = await authenticationService.login(req.body);
  res.json({ data });
}
