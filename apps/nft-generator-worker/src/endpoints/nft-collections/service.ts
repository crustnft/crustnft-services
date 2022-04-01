import { isLocal, Logger } from '@crustnft-explore/util-config-api';
import { TaskStatus } from '@crustnft-explore/data-access';
import {
  NftCollectionDto,
  NftCollectionWorkerDto,
} from '@crustnft-explore/data-access';
import R from 'ramda';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-collection';
import { downloadFiles } from '../../services/gcsService';
import {
  crustNetworkPin,
  uploadFolderToIPFS,
} from '../../services/ipfsService';
import { nftGenerator } from '../../services/nftGeneratorService';
import { WEBP_FILE_EXTENSION } from '../../constants/image';
import createHttpError from 'http-errors';
import { NftSeed } from '../../types/file';
import sha1 from '../../utils/sha1';
import { createSeeds } from '../../utils/nft-generator';
import { promises as fs } from 'fs';

const logger = Logger('nft-collections:service');

const { NFT_GENERATOR_UPLOAD_BUCKET } = process.env;

export async function createNftGenerator(generatorDto: NftCollectionWorkerDto) {
  const { id: collectionId } = generatorDto;
  const nftCollectionRecord = await findOne(collectionId);
  logger.info(
    'Start generate NFT generatorDto=%d; Collection=%j',
    generatorDto,
    nftCollectionRecord
  );

  try {
    await nftGeneratorEntity.updateEntity(collectionId, {
      status: TaskStatus.Assigned,
    });

    const { collectionCID, metadataCID } = await startGenerator(
      nftCollectionRecord,
      generatorDto
    );

    await nftGeneratorEntity.updateEntity(collectionId, {
      status: TaskStatus.Completed,
      collectionCID,
      metadataCID,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error when creating NFT collection');
    await nftGeneratorEntity.updateEntity(collectionId, {
      status: TaskStatus.Failed,
    });
  }
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

  const nftFolder = `/tmp/${nftCollection.creator}/${collectionId}/images`;
  const metadataFolder = `/tmp/${nftCollection.creator}/${collectionId}/metadata`;
  await createDirectories([nftFolder, metadataFolder]);
  const createdFilePaths = [];
  let counter = 1;
  for await (const nftImages of nftGenerator(nftSeeds, composingBatchSize)) {
    const filePaths = await storeNFT(nftFolder, nftImages, counter);
    createdFilePaths.push(...filePaths);
    counter += nftImages.length;
  }
  logger.debug(`Stored all NFTs at ${nftFolder}`);

  const ipfsFiles = await uploadFolderToIPFS(nftFolder);

  const imageDirectoryCID = getIpfsFolderCID(ipfsFiles);
  const metadataDirectoryCID = await uploadMetadataFiles(
    metadataFolder,
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

async function storeNFT(
  folderName: string,
  nftImages: Buffer[],
  counter: number
) {
  return Promise.all(
    nftImages.map(async (nftImage: Buffer, index) => {
      const filePath = `${folderName}/${
        counter + index
      }.${WEBP_FILE_EXTENSION}`;
      await fs.writeFile(filePath, nftImage);
      logger.debug(`Stored NFT at: ${filePath}`);
      return filePath;
    })
  );
}

async function uploadMetadataFiles(
  metadataFolder: string,
  nftSeeds: NftSeed[],
  nftCollection: NftCollectionDto,
  ipfsNftDirectory: string
) {
  const createdMetaFilePaths = [];
  for (let i = 0; i < nftSeeds.length; i++) {
    const metadataPath = `${metadataFolder}/${i + 1}.json`;
    await fs.writeFile(
      metadataPath,
      createImageMeta(nftSeeds[i], nftCollection, i + 1, ipfsNftDirectory)
    );
    logger.debug(`Stored metadata at: ${metadataPath}`);
    createdMetaFilePaths.push(metadataPath);
  }

  const ipfsMetaFiles = await uploadFolderToIPFS(metadataFolder);

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
  ipfsNftDirectory: string
): string {
  const metadata = {
    name: `${nftCollection.name} #${nftNumber}`,
    description: nftCollection.description,
    image: `ipfs://${ipfsNftDirectory}/${nftNumber}.${WEBP_FILE_EXTENSION}`,
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

async function createDirectories(directories: string[]) {
  try {
    await Promise.all(
      directories.map((directory: string) =>
        fs.mkdir(directory, { recursive: true })
      )
    );
  } catch (error) {
    logger.debug({ err: error }, 'create directories');
  }
}
