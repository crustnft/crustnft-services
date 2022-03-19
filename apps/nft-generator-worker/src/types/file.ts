import { Layer, Image } from '@crustnft-explore/data-access';

export interface DownloadedFile {
  fileName: string;
  content: Buffer;
}

export type ImageMeta = Image & {
  content: Buffer;
  layer: Layer;
};

export type NftSeed = ImageMeta[];
