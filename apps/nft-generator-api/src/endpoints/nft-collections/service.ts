import crypto from 'crypto';
import axios from 'axios';
import {
  CreateNftCollectionDto,
  UpdateNftCollectionDto,
  NftCollectionQueryParams,
  TaskStatus,
} from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-generator';
import storage from '../../clients/storage';
import createHttpError from 'http-errors';
import { Logger } from '@crustnft-explore/util-config-api';
import { getGoogleClientHeaders } from '../../clients/google-auth';

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_WORKER_API } = process.env;
const logger = Logger('nft-collection/service');

export async function createNftGenerator(
  createDto: CreateNftCollectionDto,
  currentUser: any
) {
  await validateMedia(createDto);
  const dto = {
    status: TaskStatus.Pending,
    ...createDto,
    creator: currentUser.account,
  };
  const collectionId = crypto
    .createHash('md5')
    .update(JSON.stringify(dto), 'utf8')
    .digest('hex');

  await nftGeneratorEntity.insertEntity({ id: collectionId, ...dto });
  logger.info(`Registered an NFT generator Id: ${collectionId}`);

  await kickStartWorker(collectionId);
  return { id: collectionId, ...dto };
}

async function kickStartWorker(taskId: string) {
  logger.info(`Kick start worker with taskId: ${taskId}`);
  const task = await findOne(taskId);
  if (task.status !== TaskStatus.Pending) {
    throw Error('Task is already in process');
  }
  try {
    await triggerWorker(taskId);
  } catch (error) {
    logger.error({ err: error }, 'Can not trigger worker');
  }
}

async function validateMedia(createDto: CreateNftCollectionDto) {
  const existedList = await Promise.all(
    createDto.images.map((media) =>
      storage.bucket(NFT_GENERATOR_UPLOAD_BUCKET).file(media.id).exists()
    )
  );
  logger.debug(existedList, 'Checking existing results.');
  const allFound = existedList.every(([existed]) => existed);
  if (!allFound) {
    throw createHttpError(500, 'At least one mediaId is not existed');
  }
}

export async function update(
  updateDto: UpdateNftCollectionDto,
  currentUser: any
) {
  const existing = await findOne(updateDto.id);
  if (currentUser.account !== existing?.creator) {
    throw new Error('Can not edit other user collection.');
  }
  const { id, ...restDto } = updateDto;
  await nftGeneratorEntity.updateEntity(id, restDto);
  return updateDto;
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  return first;
}

export async function search(query: NftCollectionQueryParams) {
  return nftGeneratorEntity.search(query);
}

async function triggerWorker(taskId: string) {
  const url = `${NFT_GENERATOR_WORKER_API}/api/v1/ntf-collections`;
  logger.debug(`trigger Worker url: ${url}, taskId: ${taskId}`);
  const { Authorization } = await getGoogleClientHeaders(url);
  axios.post(
    url,
    {
      id: taskId,
    },
    {
      headers: {
        Authorization,
      },
    }
  );
}
