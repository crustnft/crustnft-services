import datastore from '../clients/datastore';
import {
  ContractQueryParams,
  CreateContractDto,
} from '../endpoints/contracts/types';
import { SERVICE_NAME } from '../constants';
import { getAppEnv } from '../utils/environment';
import { mappingDtoToColumns } from './helper';
import { DatastoreEntitySchema } from './types';

const ENTITY_NAME = `${getAppEnv()}-${SERVICE_NAME}-contract`;

const ContractSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'txHash',
    },
    {
      name: 'chainId',
    },
    {
      name: 'account',
    },
    {
      name: 'contractAddress',
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
  const key = datastore.key([ENTITY_NAME, dto.txHash]);
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
  const { pageSize = 100, pageCursor, account } = queryParams;
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (account) {
    query = query.filter('account', '=', account);
  }
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  return datastore.runQuery(query);
}
