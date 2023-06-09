import createHttpError from 'http-errors';
import * as CollectionEntity from '../../entities/collection';
import {
  CollectionQueryParams,
  CreateCollectionDto,
  UpdateCollectionDto,
} from './types';

export async function save(createCollectionDto: CreateCollectionDto) {
  try {
    await CollectionEntity.insertEntity(createCollectionDto);
    return createCollectionDto;
  } catch (error) {
    if (error.code === 6) {
      throw createHttpError(409, `ALREADY_EXISTS`);
    }
    throw error;
  }
}

export async function search(queryParams: CollectionQueryParams) {
  return CollectionEntity.search(queryParams);
}

export async function findById(collectionId: string) {
  const [firstCollection] = await CollectionEntity.findById(collectionId);
  return firstCollection;
}

export async function deleteById(collectionId: string) {
  await CollectionEntity.removeById(collectionId);
  return collectionId;
}

export async function update(updateCollectionDto: UpdateCollectionDto) {
  await CollectionEntity.update(updateCollectionDto);
  return updateCollectionDto;
}

export async function remove(collectionId: string) {
  await CollectionEntity.remove(collectionId);
  return collectionId;
}
