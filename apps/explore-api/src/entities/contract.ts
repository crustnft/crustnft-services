import datastore from '../clients/datastore';
import {
  ContractQueryParams,
  CreateContractDto,
  UpdateContractDto,
  ContractDto,
} from '@crustnft-explore/data-access';
import { SERVICE_NAME } from '../constants';
import { getAppEnv } from '@crustnft-explore/util-config-api';
import {
  mappingDtoToColumns,
  DatastoreEntitySchema,
} from '@crustnft-explore/util-entity';

const ENTITY_NAME = `${getAppEnv()}-${SERVICE_NAME}-contract`;

const ContractSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'id',
      lowercase: true,
    },
    {
      name: 'chainId',
    },
    {
      name: 'published',
      defaultValue: false,
    },
    {
      name: 'collectionType',
    },
    {
      name: 'creator',
      lowercase: true,
    },
    {
      name: 'contractAddress',
      lowercase: true,
    },
    {
      name: 'contractContent',
      excludeFromIndexes: true,
    },
    {
      name: 'createdAt',
      defaultValue: () => new Date(),
    },
  ],
};

export function getKey(contractId) {
  return datastore.key([ENTITY_NAME, contractId]);
}

function createEntity(dto) {
  const key = datastore.key([ENTITY_NAME, dto.id]);
  const entity = {
    key,
    data: mappingDtoToColumns(dto, ContractSchema),
  };
  return entity;
}

export async function insertEntity(contractDto: CreateContractDto) {
  const entities = createEntity(contractDto);
  return datastore.insert(entities);
}

export async function removeById(contractId) {
  const key = getKey(contractId);
  return datastore.delete(key);
}

export async function findById(contractId) {
  const key = getKey(contractId);
  return datastore.get(key);
}

export async function search(queryParams: ContractQueryParams) {
  const {
    pageSize = 100,
    pageCursor,
    creator,
    order,
    offset,
    countOnly,
    published,
  } = queryParams;

  let query;
  if (countOnly === 'true') {
    query = datastore.createQuery(ENTITY_NAME).select('__key__');
  } else {
    query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
    if (offset) {
      query = query.offset(offset);
    }

    if (pageCursor) {
      query = query.start(pageCursor);
    }

    if (order) {
      const [orderField, direction] = order.split(' ');
      query = query.order(orderField, {
        descending: direction === 'desc',
      });
    }
  }

  if (creator) {
    query = query.filter('creator', '=', creator);
  }

  if (published) {
    query = query.filter('published', '=', published);
  }

  return datastore.runQuery(query);
}

export async function updateEntity(
  id: string,
  updateDto: Partial<UpdateContractDto>,
  existing?: ContractDto
) {
  const key = getKey(id);
  let existingCollection = existing;
  if (!existingCollection) {
    const collections = await datastore.get(key);
    existingCollection = collections[0];
  }
  if (existingCollection) {
    const updatedDto = { ...existingCollection, ...updateDto };
    const updateData = mappingDtoToColumns(updatedDto, ContractSchema, true);
    datastore.update({
      key,
      data: updateData,
    });
    return updatedDto;
  } else {
    throw new Error('Collection not existed');
  }
}
