import crypto from 'crypto';
import axios from 'axios';
import {
  CreateNftGeneratorDto,
  TaskStatus,
} from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-generator';
import storage from '../../clients/storage';
import createHttpError from 'http-errors';
import { Logger } from '@crustnft-explore/util-config-api';
import { getGoogleClientHeaders } from '../../clients/google-auth';

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_WORKER_API } = process.env;
const logger = Logger('nft-collection/service');

export async function createNftGenerator(createDto: CreateNftGeneratorDto) {
  await validateMedia(createDto);
  const dto = {
    status: TaskStatus.Pending,
    medias: createDto.medias,
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
  await triggerWorker(taskId);
}

async function validateMedia(createDto: CreateNftGeneratorDto) {
  const existedList = await Promise.all(
    createDto.medias.map((media) =>
      storage.bucket(NFT_GENERATOR_UPLOAD_BUCKET).file(media.mediaId).exists()
    )
  );
  const allFound = existedList.every(([existed]) => existed);
  if (!allFound) {
    throw createHttpError(500, 'At least one mediaId is not existed');
  }
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  return first;
}

async function triggerWorker(taskId: string) {
  const url = `${NFT_GENERATOR_WORKER_API}/api/v1/ntf-collections`;
  logger.debug(`url: ${url}`);
  const tokenResponse = await getGoogleClientHeaders(url);
  axios.post(
    url,
    {
      id: taskId,
    },
    {
      headers: {
        Authorization: tokenResponse.Authorization,
      },
    }
  );
}
