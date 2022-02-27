import { GetSignedUrlConfig } from '@google-cloud/storage';
import storage from '../../clients/storage';

const { NFT_GENERATOR_UPLOAD_BUCKET } = process.env;

export async function createMedia(fileName: string, contentType: string) {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 60 * 60 * 1000,
    contentType: contentType || 'application/octet-stream',
  } as GetSignedUrlConfig;

  const [signedUrl] = await storage
    .bucket(NFT_GENERATOR_UPLOAD_BUCKET)
    .file(fileName)
    .getSignedUrl(options);

  return signedUrl;
}
