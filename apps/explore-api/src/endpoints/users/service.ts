import createHttpError from 'http-errors';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
  UserSession,
} from '@crustnft-explore/data-access';
import * as UserEntity from '../../entities/user';

export async function save(createUserDto: CreateUserDto) {
  try {
    await UserEntity.insertEntity({
      ...createUserDto,
      account: createUserDto.account.toLowerCase(),
    });
    return createUserDto;
  } catch (error) {
    if (error.code === 6) {
      throw createHttpError(409, `ALREADY_EXISTS`);
    }
    throw error;
  }
}

export async function update(
  updateUserDto: UpdateUserDto,
  currentUser?: UserSession
) {
  if (currentUser) {
    const existing = await findById(updateUserDto.account);
    if (currentUser.account !== existing?.account) {
      throw Error('Can not edit other user profile');
    }
  }
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
