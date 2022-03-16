import { mappingDtoToColumns } from './helper';

describe('mapping dto', () => {
  const SCHEMA = {
    name: 'SCHEMA',
    columns: [
      {
        name: 'id',
      },
      {
        name: 'name',
        lowercase: true,
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
        name: 'CurstNFT',
      },
      SCHEMA
    );
    expect(data).toEqual([
      { excludeFromIndexes: false, name: 'id', value: 1 },
      { excludeFromIndexes: false, name: 'name', value: 'curstnft' },
      { excludeFromIndexes: true, name: 'medias', value: [] },
      { excludeFromIndexes: true, name: 'ipfsFiles', value: [] },
    ]);
  });

  test('should has throw error', () => {
    expect(() => {
      mappingDtoToColumns(
        {
          id: 1,
          medias: [],
          name2: 'CurstNFT',
        },
        SCHEMA
      );
    }).toThrow(new Error(`Entity is missing name field`));
  });
});
