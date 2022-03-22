import { createSeeds } from './nft-generator';
import { nftCollectionFixture, mockDownloadedFiles } from './fixtures';

describe('Test NFT generator', () => {
  test('should return seeds', () => {
    const expectedNumberOfSeeds = nftCollectionFixture.layers.reduce(
      (acc, layer) => acc * layer.imageIds.length,
      1
    );
    const result = createSeeds(
      nftCollectionFixture as any,
      mockDownloadedFiles as any
    );

    expect(result.length).toEqual(expectedNumberOfSeeds);
  });
});
