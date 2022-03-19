import { Logger } from '@crustnft-explore/util-config-api';
import { NftSeed } from '../types/file';
import { compositeImages, normalizeImages } from './imageService';

const logger = Logger('nftGenerator');

export function nftGenerator(nftSeeds: NftSeed[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const seed of nftSeeds) {
        const [background, ...layers] = seed;
        const normalizedLayers = await normalizeImages(background, layers);
        const content = await compositeImages(
          background.content,
          normalizedLayers
        );
        yield content;
        logger.debug(`Start generate NFT ${seed.map((image) => image.name)}`);
      }
    },
  };
}
