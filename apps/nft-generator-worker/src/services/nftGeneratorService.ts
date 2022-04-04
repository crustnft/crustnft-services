import { Logger } from '@crustnft-explore/util-config-api';
import { NftSeed } from '../types/file';
import { compositeImages, normalizeImages } from './imageService';

const logger = Logger('nftGenerator');

export function nftGenerator(nftSeeds: NftSeed[], batchSize: number) {
  return {
    async *[Symbol.asyncIterator]() {
      let counter = 0;
      while (nftSeeds.length > counter) {
        const timeLabel = `Done ${counter} NFTs, creating new ${batchSize} NFTs`;
        console.time(timeLabel);
        const seeds = nftSeeds.slice(counter, counter + batchSize);
        counter += batchSize;
        const contents = await generateNfts(seeds);
        console.timeEnd(timeLabel);
        yield contents;
      }
    },
  };
}

async function generateNfts(seeds: NftSeed[]) {
  return Promise.all(seeds.map((seed) => generateNft(seed)));
}

async function generateNft(seed: NftSeed) {
  logger.debug(`Start generate NFT ${seed.map((image) => image.name)}`);
  const [background, ...layers] = seed;
  const normalizedLayers = await normalizeImages(background, layers);
  const content = await compositeImages(background.content, normalizedLayers);
  return content;
}
