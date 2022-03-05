import { Logger } from '@crustnft-explore/util-config-api';
import createHttpError from 'http-errors';
import * as nftGeneratorEntity from '../../entities/nft-generator';
import {
  deleteFiles,
  downloadFile,
  downloadFiles,
  uploadFile,
} from '../../services/gcsService';
import { uploadToIPFS } from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { NftCollection, NftGeneratorDto } from './types';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_CREATED_BUCKET } =
  process.env;

export async function createNftGenerator(generatorDto: NftGeneratorDto) {
  const nftCollectionRecord = await findOne(generatorDto.id);
  await nftGeneratorEntity.updateEntity({
    ...nftCollectionRecord,
    status: 'started',
  });
  await startGenerator(nftCollectionRecord);
  return nftCollectionRecord;
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  return first;
}

const BACKGROUND_CATEGORY = 'background';

async function startGenerator(nftCollectionRecord: NftCollection) {
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
    // .slice(0,2) for testing
    .map((media) => media.mediaId);

  const downloadedFileList = await downloadFiles(
    NFT_GENERATOR_UPLOAD_BUCKET,
    fileIdList
  );

  logger.debug('Downloaded files');
  const folderName = nftCollectionRecord.id;
  const createdFilePaths = [];
  for await (const nft of nftGenerator(
    backgroundFile.content,
    downloadedFileList.map(({ content }) => content)
  )) {
    const { name: fileName, content } = nft;
    const filePath = `${folderName}/${fileName}`;
    await uploadFile(
      NFT_GENERATOR_CREATED_BUCKET,
      filePath,
      content,
      'image/png'
    );
    logger.debug(`Uploaded to GCS: ${filePath}`);
    createdFilePaths.push(filePath);
  }
  logger.debug(`Uploaded files to ${NFT_GENERATOR_CREATED_BUCKET}`);

  const ipfsFiles = await uploadToIPFS(
    NFT_GENERATOR_CREATED_BUCKET,
    createdFilePaths
  );

  await deleteFiles(NFT_GENERATOR_CREATED_BUCKET, createdFilePaths);

  logger.debug(`Delete folder: ${createdFilePaths}`);
  return ipfsFiles;
}
