import { isLocal, Logger } from '@crustnft-explore/util-config-api';
import { TaskStatus } from '@crustnft-explore/data-access';
import {
  NftCollectionDto,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';
import R from 'ramda';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-collection';
import { downloadFiles, uploadFile } from '../../services/gcsService';
import { crustNetworkPin, uploadToIPFS } from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { WEBP_FILE_EXTENSION, WEBP_MIME_TYPE } from '../../constants/image';
import createHttpError from 'http-errors';
import { NftSeed } from '../../types/file';
import sha1 from '../../utils/sha1';
import { createSeeds } from '../../utils/nft-generator';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET, NFT_GENERATOR_CREATED_BUCKET } =
  process.env;

export async function createNftGenerator(generatorDto: NftCollectionWorkerDto) {
  const { id: collectionId } = generatorDto;
  const nftCollectionRecord = await findOne(collectionId);
  logger.info(
    'Start generate NFT generatorDto=%d; Collection=%j',
    generatorDto,
    nftCollectionRecord
  );
  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Assigned,
  });

  const { collectionCID, metadataCID } = await startGenerator(
    nftCollectionRecord,
    generatorDto
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

async function startGenerator(
  nftCollection: NftCollectionDto,
  generatorDto: NftCollectionWorkerDto
) {
  const {
    id: collectionId,
    composingBatchSize = 2,
    collectionSize,
  } = generatorDto;

  const fileIdList = nftCollection.images.map((image) => image.id);

  const downloadedFileList = await downloadFiles(
    NFT_GENERATOR_UPLOAD_BUCKET,
    fileIdList
  );

  await nftGeneratorEntity.updateEntity(collectionId, {
    status: TaskStatus.Processing,
  });

  logger.debug('Downloaded files %j ', fileIdList);
  const initialNftSeeds = createSeeds(nftCollection, downloadedFileList);
  const nftSeeds = collectionSize
    ? R.take(collectionSize, initialNftSeeds)
    : initialNftSeeds;

  const folderName = `${nftCollection.creator}/${collectionId}`;
  const createdFilePaths = [];
  let counter = 1;
  for await (const nftImages of nftGenerator(nftSeeds, composingBatchSize)) {
    const filePaths = await updateNftToGCS(folderName, nftImages, counter);
    createdFilePaths.push(...filePaths);
    counter += nftImages.length;
  }
  logger.debug(`Uploaded files to ${NFT_GENERATOR_CREATED_BUCKET}`);

  const ipfsFiles = await uploadToIPFS(
    NFT_GENERATOR_CREATED_BUCKET,
    createdFilePaths
  );

  const imageDirectoryCID = getIpfsFolderCID(ipfsFiles);
  const metadataDirectoryCID = await uploadMetadataFiles(
    nftSeeds,
    nftCollection,
    imageDirectoryCID
  );

  pinToCrustNode(imageDirectoryCID, metadataDirectoryCID);

  return {
    collectionCID: imageDirectoryCID,
    metadataCID: metadataDirectoryCID,
  };
}

async function pinToCrustNode(
  imageDirectoryCID: string,
  metadataDirectoryCID: string
) {
  try {
    await Promise.all([
      crustNetworkPin(imageDirectoryCID, 'imageDirectoryCID'),
      crustNetworkPin(metadataDirectoryCID, 'metadataDirectoryCID'),
    ]);
  } catch (error) {
    logger.warn({ err: error }, 'Error on pinning CIDs to CrustNode');
  }
}

async function updateNftToGCS(
  folderName: string,
  nftImages: Buffer[],
  counter: number
) {
  return Promise.all(
    nftImages.map(async (nftImage: Buffer, index) => {
      const filePath = `${folderName}/images/${
        counter + index
      }.${WEBP_FILE_EXTENSION}`;
      await uploadFile(
        NFT_GENERATOR_CREATED_BUCKET,
        filePath,
        nftImage,
        WEBP_MIME_TYPE
      );
      logger.debug(`Uploaded to GCS: ${filePath}`);
      return filePath;
    })
  );
}

async function uploadMetadataFiles(
  nftSeeds: NftSeed[],
  nftCollection: NftCollectionDto,
  ipfsImagesDirectory: any
) {
  const folderName = `${nftCollection.creator}/${nftCollection.id}`;
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

  const ipfsMetaDirectoryCID = getIpfsFolderCID(ipfsMetaFiles);
  return ipfsMetaDirectoryCID;
}

function getIpfsFolderCID(ipfsList: any[]) {
  const directory = ipfsList.find((ipfs) => ipfs.path === '');
  return directory.cid.toV0().toString();
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
    image: `ipfs://${ipfsDirectory}/${nftNumber}.${WEBP_FILE_EXTENSION}`,
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
  return isLocal() ? content : sha1(content);
}
