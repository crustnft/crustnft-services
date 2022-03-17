import { Logger } from '@crustnft-explore/util-config-api';
import createHttpError from 'http-errors';
import { TaskStatus } from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-generator';
import {
  downloadFile,
  downloadFiles,
  uploadFile,
} from '../../services/gcsService';
import {
  convertToDatastoreTypes,
  uploadToIPFS,
} from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { NftCollection, NftGeneratorDto } from './types';
import { JPEG_FILE_EXTENSION, JPEG_MIME_TYPE } from '../../constants/image';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_CREATED_BUCKET } =
  process.env;

const BACKGROUND_CATEGORY = 'background';

export async function createNftGenerator(generatorDto: NftGeneratorDto) {
  const collectionId = generatorDto.id;
  const nftCollectionRecord = await findOne(collectionId);
  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Assigned,
  });

  const ipfsFiles = await startGenerator(nftCollectionRecord);

  const updateEntity = {
    status: TaskStatus.Completed,
    ipfsFiles: convertToDatastoreTypes(ipfsFiles),
  };

  await nftGeneratorEntity.updateEntity(collectionId, updateEntity);

  return findOne(collectionId);
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  if (!first) {
    throw new createHttpError[404]('Not found entity');
  }
  return first;
}

async function startGenerator(nftCollectionRecord: NftCollection) {
  const collectionId = nftCollectionRecord.id;
  const backgroundMedia = nftCollectionRecord.medias.find(
    (media) => media.category === BACKGROUND_CATEGORY
  );

  if (!backgroundMedia) {
    throw createHttpError(500, 'Missing background media.');
  }
  const backgroundId = backgroundMedia.mediaId;

  const backgroundFile = await downloadFile(
    NFT_GENERATOR_UPLOAD_BUCKET,
    backgroundId
  );

  const fileIdList = nftCollectionRecord.medias
    .filter((media) => media.category !== BACKGROUND_CATEGORY)
    .map((media) => media.mediaId);

  const downloadedFileList = await downloadFiles(
    NFT_GENERATOR_UPLOAD_BUCKET,
    fileIdList
  );

  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Processing,
  });

  logger.debug('Downloaded files');
  const folderName = collectionId;
  const createdFilePaths = [];
  for await (const nft of nftGenerator(
    backgroundFile.content,
    downloadedFileList.map(({ content }) => content)
  )) {
    const { name: fileName, content } = nft;
    const filePath = `${folderName}/${fileName}.${JPEG_FILE_EXTENSION}`;
    await uploadFile(
      NFT_GENERATOR_CREATED_BUCKET,
      filePath,
      content,
      JPEG_MIME_TYPE
    );
    logger.debug(`Uploaded to GCS: ${filePath}`);
    createdFilePaths.push(filePath);
  }
  logger.debug(`Uploaded files to ${NFT_GENERATOR_CREATED_BUCKET}`);

  const ipfsFiles = await uploadToIPFS(
    NFT_GENERATOR_CREATED_BUCKET,
    createdFilePaths
  );

  return ipfsFiles;
}
