import datastore from '../clients/datastore';
import { SERVICE_NAME } from '../constants';

const ENTITY_NAME = `${process.env.APP_ENV}-${SERVICE_NAME}-contract`;

const ContractSchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'id',
    },
    {
      name: 'txHash',
    },
    {
      name: 'address',
    },
    {
      name: 'chainId',
    },
    {
      name: 'contractContent',
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

export function getKey(contractId) {
  return datastore.key([ENTITY_NAME, datastore.int(contractId)]);
}

function createEntity(dto) {
  const key = datastore.key([ENTITY_NAME]);
  const entity = {
    key,
    data: dtoToData(dto),
  };
  return entity;
}

export async function saveEntity(contractDto) {
  const entities = createEntity(contractDto);
  return datastore.save(entities);
}

export async function removeById(contractId) {
  const key = datastore.key([ENTITY_NAME, datastore.int(contractId)]);
  await datastore.delete(key);
  return key;
}

export async function findById(contractIds) {
  const keys = contractIds.map((contractId) =>
    datastore.key([ENTITY_NAME, datastore.int(contractId)])
  );
  return datastore.get(keys);
}

export async function search(pageSize, pageCursor) {
  let query = datastore.createQuery(ENTITY_NAME).limit(pageSize);
  if (pageCursor) {
    query = query.start(pageCursor);
  }

  return datastore.runQuery(query);
}
