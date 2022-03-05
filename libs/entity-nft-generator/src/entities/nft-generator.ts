import { getAppEnv } from '@crustnft-explore/util-config-api';
import { NftGeneratorDto } from '@crustnft-explore/data-access';
import datastore from '../client/datastore';
import {
  mappingDtoToColumns,
  DatastoreEntitySchema,
} from '@crustnft-explore/util-entity';

const ENTITY_NAME = `${getAppEnv()}-nft-generator-api-collections`;

const CollectionSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'id',
    },
    {
      name: 'status',
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
    {
      name: 'createdAt',
      defaultValue: () => new Date(),
    },
  ],
};

export function getKey(id: string) {
  return datastore.key([ENTITY_NAME, id]);
}

function createEntity(dto: NftGeneratorDto) {
  const key = getKey(dto.id);
  const entity = {
    key,
    data: mappingDtoToColumns(dto, CollectionSchema),
  };
  return entity;
}

export async function insertEntity(contractDto: NftGeneratorDto) {
  const entity = createEntity(contractDto);
  return datastore.insert(entity);
}

export async function updateEntity(id: string, updateDto) {
  const key = getKey(id);
  const transaction = datastore.transaction();
  try {
    await transaction.run();
    const [existingCollection] = await transaction.get(key);
    if (existingCollection) {
      const updateData = mappingDtoToColumns(
        { ...existingCollection, ...updateDto },
        CollectionSchema
      );
      transaction.update({
        key,
        data: updateData,
      });
      await transaction.commit();
      return updateData;
    } else {
      await transaction.rollback();
      throw new Error('Collection not existed');
    }
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
}

export async function removeById(id: string) {
  const key = getKey(id);
  await datastore.delete(key);
  return key;
}

export async function findByIdList(ids: string[]) {
  const keys = ids.map((id) => getKey(id));
  return datastore.get(keys);
}

export async function findById(id: string) {
  const key = getKey(id);
  return datastore.get(key);
}

export async function search(pageSize: number, pageCursor: string) {
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  return datastore.runQuery(query);
}
