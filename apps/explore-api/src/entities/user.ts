import datastore from '../clients/datastore';
import {
  UserQueryParams,
  CreateUserDto,
  UpdateUserDto,
} from '../endpoints/users/types';
import { SERVICE_NAME } from '../constants';
import { getAppEnv } from '../utils/environment';
import {
  mappingDtoToColumns,
  DatastoreEntitySchema,
} from '@crustnft-explore/util-entity';

const ENTITY_NAME = `${getAppEnv()}-${SERVICE_NAME}-user`;

const UserSchema: DatastoreEntitySchema = {
  name: ENTITY_NAME,
  columns: [
    {
      name: 'account',
    },
    {
      name: 'avatarCID',
      defaultValue: '',
    },
    {
      name: 'displayName',
    },
    {
      name: 'nonce',
      defaultValue: '',
    },
    {
      name: 'coverCID',
      defaultValue: '',
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

export function getKey(userId) {
  return datastore.key([ENTITY_NAME, userId]);
}

function createEntity(dto) {
  const key = datastore.key([ENTITY_NAME, dto.account]);
  const entity = {
    key,
    data: mappingDtoToColumns(dto, UserSchema),
  };
  return entity;
}

export async function insertEntity(userDto: CreateUserDto) {
  const entities = createEntity(userDto);
  return datastore.insert(entities);
}

export async function removeById(userId) {
  const key = getKey(userId);
  await datastore.delete(key);
  return key;
}

export async function findById(userId) {
  const key = getKey(userId);
  return datastore.get(key);
}

export async function update(updateDto: UpdateUserDto) {
  const key = getKey(updateDto.account);
  const transaction = datastore.transaction();
  try {
    await transaction.run();
    const [existingUser] = await transaction.get(key);
    if (existingUser) {
      const updateData = mappingDtoToColumns(
        { ...existingUser, ...updateDto },
        UserSchema
      );
      transaction.update({
        key,
        data: updateData,
      });
      await transaction.commit();
      return updateData;
    } else {
      await transaction.rollback();
      throw new Error('Account not existed');
    }
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
}

export async function search(queryParams: UserQueryParams) {
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
