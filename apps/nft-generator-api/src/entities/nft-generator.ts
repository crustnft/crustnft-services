import { getAppEnv } from '@crustnft-explore/util-config-api';
import datastore from '../clients/datastore';
import { SERVICE_NAME } from '../constants';
import { NftGeneratorDto } from '../endpoints/nft-collections/types';

const ENTITY_NAME = `${getAppEnv()}-${SERVICE_NAME}-nft-generator`;

const ContractSchema = {
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
  ],
};

function dtoToData(dto) {
  return ContractSchema.columns.map((colum) => {
    const columName = colum.name;
    const excludeFromIndexes = colum.excludeFromIndexes ?? false;
    if (columName in dto) {
      return {
        name: columName,
        value: dto[columName],
        excludeFromIndexes,
      };
    } else {
      throw new Error(`Missing ${columName} field.`);
    }
  });
}

export function getKey(id: string) {
  return datastore.key([ENTITY_NAME, id]);
}

function createEntity(dto: NftGeneratorDto) {
  const key = getKey(dto.id);
  const entity = {
    key,
    data: dtoToData(dto),
  };
  return entity;
}

export async function insertEntity(contractDto: NftGeneratorDto) {
  const entities = createEntity(contractDto);
  return datastore.insert(entities);
}

export async function saveEntity(contractDto) {
  const entities = createEntity(contractDto);
  return datastore.save(entities);
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
