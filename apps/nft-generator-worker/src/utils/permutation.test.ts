import createPermutation from './permutation';

describe('test permutation', () => {
  test('should generate cases ', () => {
    expect(JSON.stringify(createPermutation([1, 2, 3]))).toEqual(
      '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'
    );
  });
});
