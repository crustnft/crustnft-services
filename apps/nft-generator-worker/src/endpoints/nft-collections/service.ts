import { Logger } from '@crustnft-explore/util-config-api';
import { TaskStatus } from '@crustnft-explore/data-access';
import {
  NftCollectionDto,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-generator';
import { downloadFiles, uploadFile } from '../../services/gcsService';
import {
  convertToDatastoreTypes,
  uploadToIPFS,
} from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { JPEG_FILE_EXTENSION, JPEG_MIME_TYPE } from '../../constants/image';
import createHttpError from 'http-errors';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_CREATED_BUCKET } =
  process.env;

export async function createNftGenerator(generatorDto: NftCollectionWorkerDto) {
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

export async function findOne(id: string): Promise<NftCollectionDto> {
  const [first] = await nftGeneratorEntity.findById(id);
  if (!first) {
    throw new createHttpError[404]('Not found entity');
  }
  return first;
}

async function startGenerator(nftCollectionRecord: NftCollectionDto) {
  const collectionId = nftCollectionRecord.id;

  const fileIdList = nftCollectionRecord.images.map((image) => image.id);

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
    downloadedFileList[0].content,
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
