import { Response, Request } from 'express';

import * as service from './service';

export async function createMedia(req: Request, res: Response) {
  const { fileName, contentType } = req.body;
  const generatedMedia = await service.createMedia(fileName, contentType);
  res.json({
    data: generatedMedia,
  });
}
