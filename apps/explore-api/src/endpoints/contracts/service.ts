import createHttpError from 'http-errors';
import * as ContractEntity from '../../entities/contract';
import { checkTransaction } from '../../services/chain-service';
import { ContractQueryParams, CreateContractDto } from './types';

export async function save(createContractDto: CreateContractDto) {
  try {
    await checkTransaction(createContractDto);
    await ContractEntity.insertEntity({
      ...createContractDto,
      account: createContractDto.account.toLowerCase(),
      contractAddress: createContractDto.contractAddress.toLowerCase(),
    });
    return createContractDto;
  } catch (error) {
    if (error.code === 6) {
      throw createHttpError(409, `ALREADY_EXISTS`);
    }
    throw error;
  }
}

export async function search(queryParams: ContractQueryParams) {
  return ContractEntity.search(queryParams);
}

export async function findById(txHash: string) {
  const [firstContract] = await ContractEntity.findById(txHash);
  return firstContract;
}
