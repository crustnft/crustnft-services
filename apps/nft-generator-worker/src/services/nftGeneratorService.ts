import { Logger } from '@crustnft-explore/util-config-api';
import createPermutation from '../utils/permutation';
import { compositeImages, normalizeImages } from './imageService';

const logger = Logger('nftGenerator');

export function nftGenerator(background: Buffer, layers: Buffer[]) {
  return {
    async *[Symbol.asyncIterator]() {
      const normalizedLayers = await normalizeImages(background, layers);
      const nftList = getPermutations(normalizedLayers);
      for (const nft of nftList) {
        logger.debug(`Start generate NFT: ${nft.name}`);
        const content = await compositeImages(background, nft.layers);
        yield {
          name: nft.name,
          content,
        };
      }
    },
  };
}

function getPermutations(layers: Buffer[]) {
  const members = Array.from(Array(layers.length), (_, x) => x);
  const permutations = createPermutation(members);
  return permutations.map((permutation) => ({
    name: permutation.join(''),
    layers: permutation.map((item: number) => layers[item]),
  }));
}
