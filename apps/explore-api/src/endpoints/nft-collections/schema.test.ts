import { GenerateNftCollectionDtoSchema } from './schema';
import testSchema from '../../utils/testSchema';

describe('NTF collection schema test', () => {
  test('should return error composingBatchSize too big ', () => {
    const result = testSchema(GenerateNftCollectionDtoSchema, {
      id: 'string',
      composingBatchSize: 24,
      collectionSize: 48,
    });

    expect(result.error.message).toEqual(
      '"composingBatchSize" must be less than or equal to 20'
    );
  });

  test('should return error on collectionSize and composingBatchSize ', () => {
    const result = testSchema(GenerateNftCollectionDtoSchema, {
      id: 'string',
      composingBatchSize: 10,
      collectionSize: 9,
    });

    expect(result.error.message).toEqual(
      'collectionSize must be greater than 2x of composingBatchSize'
    );
  });

  test('should return ok  ', () => {
    const object = {
      id: 'string',
      composingBatchSize: 10,
      collectionSize: 24,
    };
    const result = testSchema(GenerateNftCollectionDtoSchema, object);

    expect(result).toEqual({
      value: object,
    });
  });
});
