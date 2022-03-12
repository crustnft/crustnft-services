import { mappingDtoToColumns } from './helper';

describe('mapping dto', () => {
  const SCHEMA = {
    name: 'SCHEMA',
    columns: [
      {
        name: 'id',
      },
      {
        name: 'medias',
        excludeFromIndexes: true,
      },
      {
        name: 'ipfsFiles',
        defaultValue: [],
        excludeFromIndexes: true,
      },
    ],
  };
  test('should has excluded from indexes', () => {
    const data = mappingDtoToColumns(
      {
        id: 1,
        medias: [],
      },
      SCHEMA
    );
    expect(data).toEqual([
      { excludeFromIndexes: false, name: 'id', value: 1 },
      { excludeFromIndexes: true, name: 'medias', value: [] },
      { excludeFromIndexes: true, name: 'ipfsFiles', value: [] },
    ]);
  });
});
