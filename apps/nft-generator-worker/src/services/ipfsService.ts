import { Logger } from '@crustnft-explore/util-config-api';
import { globSource, urlSource } from 'ipfs-http-client';
import ipfs from '../clients/ipfs-http-client';
import { packToFs } from 'ipfs-car/pack/fs';
import { FsBlockStore } from 'ipfs-car/blockstore/fs';
import fs from 'fs';

import axios from 'axios';

const logger = Logger('ipfsService');

const { IPFS_CRUSTCODE_ENDPOINT, IPFS_CRUSTCODE_ACCESS_TOKEN } = process.env;

const BYTES_PER_MB = 1024 ** 2;
const ONE_HOUR_IN_MS = 3600_000;
const ADD_OPTIONS = {
  pin: true,
  wrapWithDirectory: true,
  timeout: ONE_HOUR_IN_MS,
};

export async function uploadToIPFSFromGCS(
  fromBucketName: string,
  fileIds: string[]
) {
  logger.info(
    `Start uploading to IPFS from bucket: ${fromBucketName}, fileIds: ${fileIds}`
  );

  const addResults = [];
  for await (const file of ipfs.addAll(
    fileIds.map((fileId) =>
      urlSource(`https://storage.googleapis.com/${fromBucketName}/${fileId}`)
    ) as any,
    ADD_OPTIONS
  )) {
    addResults.push(file);
  }
  logger.info(
    'Uploaded %d files to IPFS, last file result: %j',
    addResults.length,
    convertToV0(addResults[addResults.length - 1])
  );
  return addResults;
}

export async function uploadFolderToIPFS(path: string, globPattern = '**/*') {
  logger.info(`Start uploading to IPFS from path: ${path}`);

  const addResults = [];
  for await (const file of ipfs.addAll(
    globSource(path, globPattern),
    ADD_OPTIONS
  )) {
    addResults.push(file);
  }

  logger.info(
    'Uploaded %d files to IPFS, last file result: %j',
    addResults.length,
    convertToV0(addResults[addResults.length - 1])
  );
  return addResults;
}

export async function uploadUsingCar(folder: string): Promise<string> {
  const timeLabel = `Uploaded ${folder}`;
  console.time(timeLabel);
  const carFilePath = `${folder.replace(/\/$/, '')}.car`;
  const fileStat = await fs.promises.stat(carFilePath);
  await packToFs({
    input: folder,
    output: carFilePath,
    wrapWithDirectory: false,
    blockstore: new FsBlockStore(),
  });
  for await (const result of ipfs.dag.import(
    [fs.createReadStream(carFilePath)],
    {
      timeout: ONE_HOUR_IN_MS,
    }
  )) {
    const cidV0 = result.root.cid.toV0().toString();
    logger.info(
      'Uploaded folder %s with CAR, file size:%s MB, result: %s',
      folder,
      (fileStat.size / BYTES_PER_MB).toFixed(3),
      cidV0
    );
    console.timeEnd(timeLabel);
    crustNetworkPin(cidV0, carFilePath.split('/').pop());
    return cidV0;
  }
}

export function convertToV0(addResult: any) {
  return {
    ...addResult,
    cid: addResult.cid.toV0().toString(),
  };
}

export async function crustNetworkPin(cid: string, name: string) {
  try {
    return axios.post(
      `${IPFS_CRUSTCODE_ENDPOINT}/pins`,
      {
        cid,
        name,
      },
      {
        headers: {
          authorization: `Bearer ${IPFS_CRUSTCODE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    logger.warn({ err: error });
  }
}
