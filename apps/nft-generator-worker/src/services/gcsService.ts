import storage from '../clients/storage';
import { DownloadedFile } from '../types/file';

export async function downloadFile(bucketName: string, fileName: string) {
  const [buffer] = await storage.bucket(bucketName).file(fileName).download();
  return {
    fileName,
    content: buffer,
  };
}

export async function deleteFiles(bucketName: string, filePaths: string[]) {
  await Promise.allSettled(
    filePaths.map((filePath: string) =>
      storage.bucket(bucketName).file(filePath).delete()
    )
  );
}

export async function downloadFiles(
  bucketName: string,
  fileList: string[]
): Promise<DownloadedFile[]> {
  return Promise.all(
    fileList.map((fileName) => downloadFile(bucketName, fileName))
  );
}

export async function uploadFile(
  bucketName: string,
  fileName: string,
  fileContent: Buffer | string,
  contentType:
    | 'application/json'
    | 'image/png'
    | 'image/jpg'
    | 'image/webp'
    | 'image/jpeg' = 'image/png'
) {
  return storage.bucket(bucketName).file(fileName).save(fileContent, {
    contentType,
  });
}
