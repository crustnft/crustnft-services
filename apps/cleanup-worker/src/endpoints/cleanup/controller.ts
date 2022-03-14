import { Response, Request } from 'express';

import * as service from './service';

export async function startCleanUp(req: Request, res: Response) {
  const result = await service.startCleanUp();
  res.json({
    data: result,
  });
}
