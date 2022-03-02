import { v4 as uuidv4 } from 'uuid';

import { CreateNftGeneratorDto } from './types';
import * as nftGeneratorEntity from '../../entities/nft-generator';
import storage from '../../clients/storage';
import createHttpError from 'http-errors';

const { NFT_GENERATOR_UPLOAD_BUCKET } = process.env;

export async function createNftGenerator(createDto: CreateNftGeneratorDto) {
  await validateMedia(createDto);
  const id = uuidv4();
  const dto = {
    id,
    status: 'initiated',
    medias: createDto.medias,
  };
  await nftGeneratorEntity.insertEntity(dto);
  return dto;
}

async function validateMedia(createDto: CreateNftGeneratorDto) {
  const existedList = await Promise.all(
    createDto.medias.map((media) =>
      storage.bucket(NFT_GENERATOR_UPLOAD_BUCKET).file(media.mediaId).exists()
    )
  );
  const notFound = existedList.filter((existed) => !!existed);
  if (notFound.length > 0) {
    throw createHttpError(500, 'Missing one or more files in list media');
  }
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  return first;
}
