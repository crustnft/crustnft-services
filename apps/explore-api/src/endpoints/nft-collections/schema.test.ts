import { GenerateNftCollectionDtoSchema } from './schema';
import testSchema from '../../utils/testSchema';

describe('NTF collection schema test', () => {
  test('should return error on collectionSize negative ', () => {
    const result = testSchema(GenerateNftCollectionDtoSchema, {
      id: 'string',
      collectionSize: -48,
    });

    expect(result.error.message).toEqual(
      '"collectionSize" must be a positive number'
    );
  });

  test('should not return error when collectionSize is omitted', () => {
    const result = testSchema(GenerateNftCollectionDtoSchema, {
      id: 'string',
    });

    expect(result.error).toBeUndefined();
  });
});
