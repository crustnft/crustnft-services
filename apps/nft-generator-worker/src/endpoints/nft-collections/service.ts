import sharp from 'sharp';
import { Logger } from '@crustnft-explore/util-config-api';
import storage from '../../clients/storage';
import * as nftGeneratorEntity from '../../entities/nft-generator';
import { NftCollection, NftGeneratorDto } from './types';
import ipfs from '../../clients/ipfs-http-client';

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

  let backgroundId = '';
  if (backgroundMedia) {
    backgroundId = backgroundMedia.mediaId;
  }

  let backgroundFile: Buffer;
  if (backgroundFile) {
    backgroundFile = (
      await downloadFile(NFT_GENERATOR_UPLOAD_BUCKET, backgroundId)
    ).content;
  }

  const fileIdList = nftCollectionRecord.medias
    .filter((media) => media.category !== BACKGROUND_CATEGORY)
    .map((media) => media.mediaId);

  const downloadedFileList = await downloadFiles(
    NFT_GENERATOR_UPLOAD_BUCKET,
    fileIdList
  );
  logger.debug('Downloaded files');
  const folderName = nftCollectionRecord.id;
  //TODO: generate a single nft

  await Promise.all(
    downloadedFileList.map(({ fileName, content }) => {
      uploadFile(
        NFT_GENERATOR_CREATED_BUCKET,
        `${folderName}/${fileName}`,
        content
      );
    })
  );

  logger.debug(`Uploaded files to ${NFT_GENERATOR_CREATED_BUCKET}`);

  const filePaths = downloadedFileList.map(
    ({ fileName }) => `${folderName}/${fileName}`
  );

  const ipfsFiles = await uploadToIPFS(NFT_GENERATOR_CREATED_BUCKET, filePaths);
  logger.info('Uploaded file to IPFS: ', ipfsFiles);

  await deleteFiles(NFT_GENERATOR_CREATED_BUCKET, filePaths);

  logger.debug(`Delete folder: ${filePaths}`);
  return ipfsFiles;
}

async function readImageMeta(image: Buffer) {
  const { format, height, width } = await sharp(image).metadata();
  console.log('meta: ', { format, height, width });
}

async function downloadFile(bucketName: string, fileName: string) {
  const [buffer] = await storage.bucket(bucketName).file(fileName).download();
  return {
    fileName,
    content: buffer,
  };
}

async function deleteFiles(bucketName: string, filePaths: string[]) {
  await Promise.allSettled(
    filePaths.map((filePath: string) =>
      storage.bucket(bucketName).file(filePath).delete()
    )
  );
}

async function downloadFiles(
  bucketName: string,
  fileList: string[]
): Promise<
  {
    fileName: string;
    content: Buffer;
  }[]
> {
  return Promise.all(
    fileList.map((fileName) => downloadFile(bucketName, fileName))
  );
}

async function uploadFile(
  bucketName: string,
  fileName: string,
  fileContent: Buffer
) {
  return storage.bucket(bucketName).file(fileName).save(fileContent);
}

async function uploadToIPFS(fromBucketName: string, fileIds: string[]) {
  const addOptions = {
    pin: true,
    wrapWithDirectory: true,
    timeout: 100000,
  };

  const addResults = [];
  for await (const file of ipfs.addAll(
    asyncReadFileIterable(fromBucketName, fileIds),
    addOptions
  )) {
    addResults.push(file);
  }
  return addResults;
}

function asyncReadFileIterable(bucketName: string, fileIdList: string[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const fileId of fileIdList) {
        const content = await downloadFile(bucketName, fileId);
        yield content;
      }
    },
  };
}
