import { Logger } from '@crustnft-explore/util-config-api';
import { urlSource } from 'ipfs-http-client';
import ipfs from '../clients/ipfs-http-client';

const logger = Logger('ipfsService');

const ADD_OPTIONS = {
  pin: true,
  wrapWithDirectory: true,
  timeout: 100_000,
};

export async function uploadToIPFS(fromBucketName: string, fileIds: string[]) {
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
  logger.info('Uploaded file to IPFS: ', addResults);
  return addResults;
}

export function convertToDatastoreTypes(addResults: any[]) {
  return addResults.map(({ path, cid, size }) => ({
    path: path,
    cid: cid.toV1().toString(),
    size,
  }));
}
