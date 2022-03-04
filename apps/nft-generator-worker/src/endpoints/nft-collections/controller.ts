import { Response, Request } from 'express';

import * as service from './service';

export async function create(req: Request, res: Response) {
  const initiatedCollection = await service.createNftGenerator(req.body);
  res.json({
    data: initiatedCollection,
  });
}
