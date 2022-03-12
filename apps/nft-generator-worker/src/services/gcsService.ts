import storage from '../clients/storage';

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

export async function uploadFile(
  bucketName: string,
  fileName: string,
  fileContent: Buffer,
  contentType: 'image/png' | 'image/jpg' | 'image/jpeg' = 'image/png'
) {
  return storage.bucket(bucketName).file(fileName).save(fileContent, {
    contentType,
  });
}
