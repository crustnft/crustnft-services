import { Response, Request } from 'express';
import R from 'ramda';
import {
  NftCollectionQueryParams,
  UserSession,
  TaskStatus,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';

import * as service from './service';
import createHttpError from 'http-errors';

export async function create(req: Request, res: Response) {
  const currentUser = req.user as UserSession;

  service.validateImageIds(req.body);
  const initiatedCollection = await service.createNftCollection(
    req.body,
    currentUser
  );

  res.json({
    data: initiatedCollection,
  });
}

export async function update(req: Request, res: Response) {
  const data = await service.update(req.body, req.user as UserSession);

  res.json({
    data,
  });
}

export async function findOne(req: Request, res: Response) {
  const currentUser = req.user as UserSession;

  const { collectionId } = req.params;
  const collection = await service.findOne(collectionId);
  if (currentUser.account === collection.creator) {
    res.json({
      data: collection,
    });
    return;
  }
  throw new createHttpError[403]();
}

export async function listingCollection(req: Request, res: Response) {
  const query = req.query as unknown as NftCollectionQueryParams;

  if (query.countOnly === 'true') {
    const [collections] = await service.search({
      ...query,
      status: TaskStatus.Completed,
    });

    res.json({
      data: collections.length,
    });
    return;
  }

  const [collections, pagination] = await service.search({
    ...query,
    status: TaskStatus.Completed,
  });

  res.json({
    data: collections.map((collection) =>
      R.omit(['images', 'layers', 'layerOrder'], collection)
    ),
    pagination,
  });
}

export async function searchCollection(req: Request, res: Response) {
  const currentUser = req.user as UserSession;

  const query = req.query as unknown as NftCollectionQueryParams;

  if (query.countOnly === 'true') {
    const [collections] = await service.search({
      ...query,
      creator: currentUser.account,
    });

    res.json({
      data: collections.length,
    });
    return;
  }

  const [data, pagination] = await service.search({
    ...query,
    creator: currentUser.account,
  });

  res.json({
    data,
    pagination,
  });
}

export async function generateNft(req: Request, res: Response) {
  const currentUser = req.user as UserSession;

  const body = req.body as NftCollectionWorkerDto;

  const collection = await service.findOne(body.id);

  if (currentUser.account === collection.creator) {
    const data = await service.generateNft(collection, body);
    res.json({
      data,
    });
    return;
  }
  throw new createHttpError[403]();
}
