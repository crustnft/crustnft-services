import * as ContractEntity from '../../entities/contract';

export async function save(contractDto) {
  //TODO: Validate txHash before insert
  return ContractEntity.saveEntity(contractDto);
}

export async function search(pageSize, pageCursor) {
  return ContractEntity.search(pageSize, pageCursor);
}
