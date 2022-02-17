import * as ContractEntity from '../../entities/contract';
import { checkTransaction } from '../../services/chain-service';
import { CreateContractDto } from './types';

export async function save(contractDto: CreateContractDto) {
  await checkTransaction(contractDto);
  return ContractEntity.insertEntity(contractDto);
}

export async function search(pageSize, pageCursor) {
  return ContractEntity.search(pageSize, pageCursor);
}

export async function findById(txHash: string) {
  return ContractEntity.findById(txHash);
}
