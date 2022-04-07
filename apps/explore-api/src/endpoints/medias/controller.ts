import { Response, Request } from 'express';
import { UserSession } from '@crustnft-explore/data-access';

import * as service from './service';

export async function createMedia(req: Request, res: Response) {
  const currentUser = req.user as UserSession;
  const { fileName, contentType } = req.body;

  const filePath = `${currentUser.account}/${fileName}`;

  const generatedMedia = await service.createMedia(filePath, contentType);

  res.json({
    data: generatedMedia,
  });
}
