import datastore from '../clients/datastore';
import { SERVICE_NAME } from '../constants';
import {
  CollectionQueryParams,
  CreateCollectionDto,
  UpdateCollectionDto,
} from '../endpoints/collections/types';
import { getAppEnv } from '../utils/environment';
import { mappingDtoToColumns } from './helper';
import { DatastoreEntitySchema } from './types';

const ENTITY_NAME = `${getAppEnv()}-${SERVICE_NAME}-collection`;

const CollectionSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'id',
    },
    {
      name: 'account',
    },
    {
      name: 'avatarUrl',
      defaultValue: '',
    },
    {
      name: 'coverUrl',
      defaultValue: '',
    },
    {
      name: 'description',
      excludeFromIndexes: true,
    },
    {
      name: 'socialUrls',
      defaultValue: [],
      excludeFromIndexes: true,
    },
    {
      name: 'createdAt',
      defaultValue: () => new Date(),
    },
  ],
};

export function getKey(collectionId: string) {
  return datastore.key([ENTITY_NAME, collectionId]);
}

function createEntity(dto: CreateCollectionDto) {
  const key = getKey(dto.id);
  const entity = {
    key,
    data: mappingDtoToColumns(dto, CollectionSchema),
  };
  return entity;
}

export async function insertEntity(collectionDto: CreateCollectionDto) {
  const entities = createEntity(collectionDto);
  return datastore.insert(entities);
}

export async function removeById(collectionId) {
  const key = getKey(collectionId);
  await datastore.delete(key);
  return key;
}

export async function findById(collectionId) {
  const key = getKey(collectionId);
  return datastore.get(key);
}

export async function remove(collectionId) {
  const key = getKey(collectionId);
  return datastore.delete(key);
}

export async function search(queryParams: CollectionQueryParams) {
  const { pageSize = 100, pageCursor, order } = queryParams;
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  if (order) {
    const [orderField, direction] = order.split(' ');
    query = query.order(orderField, {
      descending: direction === 'desc',
    });
  }

  return datastore.runQuery(query);
}

export async function update(collectionDto: UpdateCollectionDto) {
  const key = getKey(collectionDto.id);
  const transaction = datastore.transaction();
  try {
    await transaction.run();
    const [existingCollection] = await transaction.get(key);
    if (existingCollection) {
      const updateData = mappingDtoToColumns(
        { ...existingCollection, ...collectionDto },
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
