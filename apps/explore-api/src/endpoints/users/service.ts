import createHttpError from 'http-errors';
import * as UserEntity from '../../entities/user';
import { UserQueryParams, CreateUserDto, UpdateUserDto } from './types';

export async function save(createUserDto: CreateUserDto) {
  try {
    await UserEntity.insertEntity(createUserDto);
    return createUserDto;
  } catch (error) {
    if (error.code === 6) {
      throw createHttpError(409, `ALREADY_EXISTS`);
    }
    throw error;
  }
}

export async function update(updateUserDto: UpdateUserDto) {
  await UserEntity.update(updateUserDto);
  return updateUserDto;
}

export async function search(queryParams: UserQueryParams) {
  return UserEntity.search(queryParams);
}

export async function findById(txHash: string) {
  const [firstUser] = await UserEntity.findById(txHash);
  return firstUser;
}
