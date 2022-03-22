import createPermutation, { combine } from './array';

describe('Test array', () => {
  test('should return combined values', () => {
    const layers = [
      {
        id: '1',
        name: 'layer1',
        imageIds: ['1', '2', '4'],
      },
      {
        id: '2',
        name: 'layer2',
        imageIds: ['7', '6', '5'],
      },
      {
        id: '3',
        name: 'layer3',
        imageIds: ['a', 'b', 'c'],
      },
    ];
    const result = combine(layers);

    expect(result).toEqual([
      '0;0;0',
      '0;0;1',
      '0;0;2',
      '0;1;0',
      '0;1;1',
      '0;1;2',
      '0;2;0',
      '0;2;1',
      '0;2;2',
      '1;0;0',
      '1;0;1',
      '1;0;2',
      '1;1;0',
      '1;1;1',
      '1;1;2',
      '1;2;0',
      '1;2;1',
      '1;2;2',
      '2;0;0',
      '2;0;1',
      '2;0;2',
      '2;1;0',
      '2;1;1',
      '2;1;2',
      '2;2;0',
      '2;2;1',
      '2;2;2',
    ]);
  });

  test('should generate cases ', () => {
    expect(JSON.stringify(createPermutation([1, 2, 3]))).toEqual(
      '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'
    );
  });
});
