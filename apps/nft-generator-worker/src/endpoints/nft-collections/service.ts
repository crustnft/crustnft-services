import { Logger } from '@crustnft-explore/util-config-api';
import { TaskStatus } from '@crustnft-explore/data-access';
import {
  NftCollectionDto,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-collection';
import { downloadFiles, uploadFile } from '../../services/gcsService';
import { uploadToIPFS } from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { JPEG_FILE_EXTENSION, JPEG_MIME_TYPE } from '../../constants/image';
import createHttpError from 'http-errors';
import { combine } from '../../utils/combination';
import { DownloadedFile, NftSeed } from '../../types/file';
import sha1 from '../../utils/sha1';
import shuffle from '../../utils/shuffle';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_CREATED_BUCKET } =
  process.env;

export async function createNftGenerator(generatorDto: NftCollectionWorkerDto) {
  const collectionId = generatorDto.id;
  const nftCollectionRecord = await findOne(collectionId);
  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Assigned,
  });

  const { collectionCID, metadataCID } = await startGenerator(
    nftCollectionRecord
  );

  const updateEntity = {
    status: TaskStatus.Completed,
    collectionCID,
    metadataCID,
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

async function startGenerator(nftCollection: NftCollectionDto) {
  const collectionId = nftCollection.id;

  const fileIdList = nftCollection.images.map((image) => image.id);

  const downloadedFileList = await downloadFiles(
    NFT_GENERATOR_UPLOAD_BUCKET,
    fileIdList
  );

  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Processing,
  });

  logger.debug('Downloaded files');
  const listDNA = combine(nftCollection.layers);
  const nftSeeds = createSeeds(listDNA, nftCollection, downloadedFileList);
  const shuffledNftSeeds = shuffle(nftSeeds);
  const folderName = collectionId;
  const createdFilePaths = [];
  let counter = 0;
  for await (const nftImage of nftGenerator(shuffledNftSeeds)) {
    counter++;
    const filePath = `${folderName}/images/${counter}.${JPEG_FILE_EXTENSION}`;
    await uploadFile(
      NFT_GENERATOR_CREATED_BUCKET,
      filePath,
      nftImage,
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

  const ipfsImagesDirectory = getIpfsFolder(ipfsFiles);
  const ipfsMetaDirectory = await uploadMetadataFiles(
    shuffledNftSeeds,
    nftCollection,
    ipfsImagesDirectory
  );

  return {
    collectionCID: ipfsImagesDirectory,
    metadataCID: ipfsMetaDirectory,
  };
}

async function uploadMetadataFiles(
  nftSeeds: NftSeed[],
  nftCollection: NftCollectionDto,
  ipfsImagesDirectory: any
) {
  const folderName = nftCollection.id;
  const createdMetaFilePaths = [];
  for (let i = 0; i < nftSeeds.length; i++) {
    const metadataPath = `${folderName}/metadata/${i + 1}.json`;
    await uploadFile(
      NFT_GENERATOR_CREATED_BUCKET,
      metadataPath,
      createImageMeta(nftSeeds[i], nftCollection, i + 1, ipfsImagesDirectory),
      'application/json'
    );
    logger.debug(`Uploaded to GCS: ${metadataPath}`);
    createdMetaFilePaths.push(metadataPath);
  }

  const ipfsMetaFiles = await uploadToIPFS(
    NFT_GENERATOR_CREATED_BUCKET,
    createdMetaFilePaths
  );

  const ipfsMetaDirectory = getIpfsFolder(ipfsMetaFiles);
  return ipfsMetaDirectory;
}

function getIpfsFolder(ipfsList: any[]) {
  const directory = ipfsList.find((ipfs) => ipfs.path === '');
  return directory.cid.toV0().toString();
}

function createSeeds(
  listDNA: string[],
  nftCollection: NftCollectionDto,
  downloadFiles: DownloadedFile[]
): NftSeed[] {
  const orders = nftCollection.layerOrder;
  return listDNA.map((dna: string) => {
    const indexes = dna.split(';');
    const seed = [];
    for (let i = 0; i < indexes.length; i++) {
      const layerId = orders[i];
      const layer = nftCollection.layers.find((layer) => layer.id === layerId);
      const imageId = layer.imageIds[indexes[i]];
      const image = nftCollection.images.find((image) => image.id === imageId);
      seed.push({
        layer,
        ...image,
        content: downloadFiles.find((file) => file.fileName === imageId)
          .content,
      });
    }
    return seed;
  });
}

function createImageMeta(
  nftSeed: NftSeed,
  nftCollection: NftCollectionDto,
  nftNumber: number,
  ipfsDirectory: string
): string {
  const metadata = {
    name: `${nftCollection.name} #${nftNumber}`,
    description: nftCollection.description,
    image: `ipfs://${ipfsDirectory}/${nftNumber}.jpeg`,
    dna: getDnaHash(nftSeed),
    date: new Date().toISOString(),
    edition: nftNumber,
    attributes: nftSeed.map((image) => ({
      trait_type: image.layer.name,
      value: image.name,
    })),
  };
  return JSON.stringify(metadata, null, 4);
}

function getDnaHash(nftSeed: NftSeed) {
  const content = nftSeed.map((image) => image.id).join();
  return sha1(content);
}
