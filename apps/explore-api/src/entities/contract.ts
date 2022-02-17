import datastore from '../clients/datastore';
import { SERVICE_NAME } from '../constants';
import {
  ContractQueryParams,
  CreateContractDto,
} from '../endpoints/contracts/types';

const ENTITY_NAME = `${process.env.APP_ENV}-${SERVICE_NAME}-contract`;

const ContractSchema = {
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

function dtoToData(dto) {
  return ContractSchema.columns.map((colum) => {
    const columName = colum.name;
    const excludeFromIndexes = colum.excludeFromIndexes ?? false;
    let fieldData = {};
    if (columName in dto) {
      fieldData = {
        name: columName,
        value: dto[columName],
      };
    } else if (colum.defaultValue) {
      fieldData = {
        name: columName,
        value:
          typeof colum.defaultValue === 'function'
            ? colum.defaultValue()
            : colum.defaultValue,
      };
    } else {
      throw new Error(`Missing ${columName} field.`);
    }
    return {
      ...fieldData,
      excludeFromIndexes,
    };
  });
}

export function getKey(contractId) {
  return datastore.key([ENTITY_NAME, datastore.int(contractId)]);
}

function createEntity(dto) {
  const key = datastore.key([ENTITY_NAME, dto.txHash]);
  const entity = {
    key,
    data: dtoToData(dto),
  };
  return entity;
}

export async function insertEntity(contractDto: CreateContractDto) {
  const entities = createEntity(contractDto);
  return datastore.insert(entities);
}

export async function removeById(contractId) {
  const key = datastore.key([ENTITY_NAME, contractId]);
  await datastore.delete(key);
  return key;
}

export async function findById(contractId) {
  const key = datastore.key([ENTITY_NAME, contractId]);
  return datastore.get(key);
}

export async function search(queryParams: ContractQueryParams) {
  const { pageSize, pageCursor, account } = queryParams;
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (account) {
    query = query.filter('account', '=', account);
  }
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  return datastore.runQuery(query);
}
