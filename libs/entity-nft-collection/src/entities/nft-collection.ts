import { getAppEnv } from '@crustnft-explore/util-config-api';
import {
  NftCollectionDto,
  NftCollectionQueryParams,
} from '@crustnft-explore/data-access';
import datastore from '../client/datastore';
import {
  mappingDtoToColumns,
  DatastoreEntitySchema,
} from '@crustnft-explore/util-entity';

const ENTITY_NAME = `${getAppEnv()}-nft-collections`;

const CollectionSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'id',
    },
    {
      name: 'name',
    },
    {
      name: 'description',
      excludeFromIndexes: true,
    },
    {
      name: 'creator',
      lowercase: true,
    },
    {
      name: 'status',
    },
    {
      name: 'images',
      excludeFromIndexes: true,
    },
    {
      name: 'layers',
      excludeFromIndexes: true,
    },
    {
      name: 'layerOrder',
      excludeFromIndexes: true,
    },
    {
      name: 'collectionCID',
      defaultValue: '',
      excludeFromIndexes: true,
    },
    {
      name: 'metadataCID',
      defaultValue: '',
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

function createEntity(dto: NftCollectionDto) {
  const key = getKey(dto.id);
  const entity = {
    key,
    data: mappingDtoToColumns(dto, CollectionSchema),
  };
  return entity;
}

export async function insertEntity(contractDto: NftCollectionDto) {
  const entity = createEntity(contractDto);
  return datastore.insert(entity);
}

export async function updateEntity(
  id: string,
  updateDto: Partial<NftCollectionDto>,
  existing?: NftCollectionDto
) {
  const key = getKey(id);
  let existingCollection = existing;
  if (!existingCollection) {
    const collections = await datastore.get(key);
    existingCollection = collections[0];
  }
  if (existingCollection) {
    const updateData = mappingDtoToColumns(
      { ...existingCollection, ...updateDto },
      CollectionSchema
    );
    datastore.update({
      key,
      data: updateData,
    });
    return updateData;
  } else {
    throw new Error('Collection not existed');
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

export async function search(queryParams: NftCollectionQueryParams) {
  const { pageSize = 100, pageCursor, creator } = queryParams;
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (creator) {
    query = query.filter('creator', '=', creator);
  }
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  return datastore.runQuery(query);
}
