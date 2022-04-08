import axios from 'axios';
import {
  CreateNftCollectionDto,
  UpdateNftCollectionDto,
  NftCollectionQueryParams,
  NftCollectionDto,
  TaskStatus,
  UserSession,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-collection';
import storage from '../../clients/storage';
import createHttpError from 'http-errors';
import { Logger } from '@crustnft-explore/util-config-api';
import { getGoogleClientHeaders } from '../../clients/google-auth';
import sha1 from '../../utils/sha1';

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_WORKER_API } = process.env;
const logger = Logger('nft-collection/service');

export async function createNftCollection(
  createDto: CreateNftCollectionDto,
  currentUser: UserSession
) {
  const dto = {
    status: TaskStatus.Pending,
    ...createDto,
    creator: currentUser.account,
  };

  const collectionId = sha1(JSON.stringify(dto));

  await nftGeneratorEntity.insertEntity({ id: collectionId, ...dto });
  logger.info(`Registered an NFT generator Id: ${collectionId}`);
  return { id: collectionId, ...dto };
}

export async function generateNft(
  collection: NftCollectionDto,
  workerDto: NftCollectionWorkerDto
) {
  await validateImages(collection);
  await kickStartWorker(workerDto);
  return collection;
}

export async function update(
  nftCollection: UpdateNftCollectionDto,
  currentUser: UserSession
) {
  let updateDto: Partial<UpdateNftCollectionDto> = nftCollection;

  const existing = await findOne(updateDto.id);
  if (existing.status === TaskStatus.Completed) {
    updateDto = {
      id: nftCollection.id,
      txHash: nftCollection.txHash,
      whitelist: nftCollection.whitelist,
    };
  } else if (
    existing.status !== TaskStatus.Pending &&
    existing.status !== TaskStatus.Failed
  ) {
    throw new Error(
      `You can't update collection with status ${existing.status}.`
    );
  }

  if (currentUser.account !== existing?.creator) {
    throw new Error('Can not edit other user collection.');
  }
  const { id, ...restDto } = updateDto;
  await nftGeneratorEntity.updateEntity(id, restDto, existing);
  return updateDto;
}

export async function findOne(id: string): Promise<NftCollectionDto> {
  const [collection] = await nftGeneratorEntity.findById(id);
  if (!collection) {
    throw new createHttpError[404]('Not found entity');
  }
  return collection;
}

export async function search(query: NftCollectionQueryParams) {
  return nftGeneratorEntity.search(query);
}

export function validateImageIds(
  dto: CreateNftCollectionDto | UpdateNftCollectionDto
) {
  const imageIds = dto.images.map((img) => img.id);
  const setImageIds = new Set(imageIds);
  if (setImageIds.size !== imageIds.length) {
    throw createHttpError(400, 'images contains duplicated items');
  }

  const imageIdsOfLayers = dto.layers
    .map((layer) => layer.imageIds)
    .flatMap((item) => item);
  const setImageIdsOfLayers = new Set(imageIdsOfLayers);

  if (setImageIds.size !== setImageIdsOfLayers.size) {
    throw createHttpError(
      400,
      'images size and total number images in layers are different'
    );
  }

  for (const imageId of imageIdsOfLayers) {
    if (!setImageIds.has(imageId)) {
      throw createHttpError(400, `ImageId ${imageId} is not found in images`);
    }
  }
  return true;
}

async function validateImages(createDto: CreateNftCollectionDto) {
  const existedList = await Promise.all(
    createDto.images.map((image) =>
      storage.bucket(NFT_GENERATOR_UPLOAD_BUCKET).file(image.id).exists()
    )
  );
  logger.debug('Checking existing results %j', existedList);
  const allFound = existedList.every(([existed]) => existed);
  if (!allFound) {
    throw createHttpError(500, 'At least one imageId is not existed');
  }
}

async function kickStartWorker(workerDto: NftCollectionWorkerDto) {
  const taskId = workerDto.id;
  logger.info(`Kick start worker with taskId: ${taskId}`);
  const task = await findOne(taskId);
  if (task.status !== TaskStatus.Pending && task.status !== TaskStatus.Failed) {
    throw Error(`Can not start task with status ${task.status}`);
  }
  try {
    await triggerWorker(workerDto);
  } catch (error) {
    logger.error({ err: error }, 'Can not trigger worker: %s', error.message);
  }
}

async function triggerWorker(workerDto: NftCollectionWorkerDto) {
  const url = `${NFT_GENERATOR_WORKER_API}/api/v1/ntf-collections`;
  logger.debug(`trigger Worker url: ${url}, workerDto: %j`, workerDto);
  const { Authorization } = await getGoogleClientHeaders(url);

  axios.post(url, workerDto, {
    headers: {
      Authorization,
    },
  });
}
