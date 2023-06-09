import { NftCollectionDto, Layer } from '@crustnft-explore/data-access';
import { Logger } from '@crustnft-explore/util-config-api';
import { DownloadedFile, NftSeed } from '../types/file';
import { combine } from './array';
import shuffle from './shuffle';

const logger = Logger('nft-generator');

export function createSeeds(
  nftCollection: NftCollectionDto,
  downloadFiles: DownloadedFile[]
): NftSeed[] {
  const listDNA = combine(
    getOrderedLayers(nftCollection.layers, nftCollection.layerOrder)
  );
  logger.debug('List DNA files %j ', listDNA);
  const orders = nftCollection.layerOrder;

  const seeds = listDNA.map((dna: string) => {
    const indexes = dna.split(';');
    const seed = [];
    for (let i = 0; i < indexes.length; i++) {
      const layerId = orders[i];
      const layer = nftCollection.layers.find((layer) => layer.id === layerId);
      const imageId = layer.imageIds[indexes[i]];
      const image = nftCollection.images.find((image) => image.id === imageId);
      const file = downloadFiles.find(
        (file) => file.fileName === `${nftCollection.creator}/${imageId}`
      );
      seed.push({
        layer,
        ...image,
        content: file.content,
      });
    }
    return seed;
  });

  return shuffle(seeds);
}

function getOrderedLayers(layers: Layer[], layerOrders: string[]) {
  return layerOrders.map((layerId) =>
    layers.find((layer) => layer.id === layerId)
  );
}
