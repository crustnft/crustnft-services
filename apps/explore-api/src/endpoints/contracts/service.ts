import createHttpError from 'http-errors';
import * as ContractEntity from '../../entities/contract';
import {
  ContractDto,
  ContractQueryParams,
  CreateContractDto,
  UpdateContractDto,
} from '@crustnft-explore/data-access';

export async function save(createContractDto: CreateContractDto) {
  try {
    await ContractEntity.insertEntity(createContractDto);
    return createContractDto;
  } catch (error) {
    if (error.code === 6) {
      throw createHttpError(409, `ALREADY_EXISTS`);
    }
    throw error;
  }
}

export async function update(
  update: UpdateContractDto,
  existing?: ContractDto
) {
  return ContractEntity.updateEntity(existing.txHash, update, existing);
}

export async function search(queryParams: ContractQueryParams) {
  return ContractEntity.search(queryParams);
}

export async function findById(txHash: string): Promise<ContractDto> {
  const [firstContract] = await ContractEntity.findById(txHash);
  return firstContract;
}
