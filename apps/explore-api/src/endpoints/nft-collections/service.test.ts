import { validateImageIds } from './service';
import { createNftCollectionRequestBodyFixture } from '../../__mocks__/nft-collection';

describe('nft-collection services', () => {
  test('should not throw error', () => {
    const result = validateImageIds(
      createNftCollectionRequestBodyFixture as any
    );
    expect(result).toBeTruthy();
  });

  test('should throw  size error', () => {
    expect(() => {
      validateImageIds({
        images: [{ id: 1 }],
        layers: [
          {
            imageIds: [1, 2],
          },
        ],
      } as any);
    }).toThrow(
      new Error('images size and total number images in layers are different')
    );
  });

  test('should throw  duplicated error', () => {
    expect(() => {
      validateImageIds({
        images: [{ id: 1 }, { id: 1 }],
        layers: [
          {
            imageIds: [1, 2],
          },
        ],
      } as any);
    }).toThrow(new Error('images contains duplicated items'));
  });

  test('should throw  not found image error', () => {
    expect(() => {
      validateImageIds({
        images: [{ id: 1 }, { id: 2 }, { id: 4 }],
        layers: [
          {
            imageIds: [1, 2],
          },
          {
            imageIds: [1, 3],
          },
        ],
      } as any);
    }).toThrow(new Error('ImageId 3 is not found in images'));
  });
});
