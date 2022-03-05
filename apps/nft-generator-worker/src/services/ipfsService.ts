import { Logger } from '@crustnft-explore/util-config-api';
import ipfs from '../clients/ipfs-http-client';
import { downloadFile } from './gcsService';

const logger = Logger('ipfsService');

const ADD_OPTIONS = {
  pin: true,
  wrapWithDirectory: true,
  timeout: 100000,
};

export async function uploadToIPFS(fromBucketName: string, fileIds: string[]) {
  logger.info(
    `Start uploading to IPFS from bucket: ${fromBucketName}, fileIds: ${fileIds}`
  );

  const addResults = [];
  for await (const file of ipfs.addAll(
    asyncReadFileIterable(fromBucketName, fileIds),
    ADD_OPTIONS
  )) {
    addResults.push(file);
  }
  logger.info('Uploaded file to IPFS: ', addResults);
  return addResults;
}

function asyncReadFileIterable(bucketName: string, fileIdList: string[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const fileId of fileIdList) {
        const content = await downloadFile(bucketName, fileId);
        logger.debug(
          `Downloaded file from GCS, bucket: ${bucketName}, fileId: ${fileId}`
        );
        yield content;
      }
    },
  };
}
