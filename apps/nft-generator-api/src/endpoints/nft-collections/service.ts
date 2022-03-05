import { v4 as uuidv4 } from 'uuid';

import { CreateNftGeneratorDto } from '@crustnft-explore/data-access';
import * as nftGeneratorEntity from '@crustnft-explore/entity-nft-generator';
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
  const allFound = existedList.every(([existed]) => existed);
  if (!allFound) {
    throw createHttpError(500, 'At least one mediaId is not existed');
  }
}

export async function findOne(id: string) {
  const [first] = await nftGeneratorEntity.findById(id);
  return first;
}
