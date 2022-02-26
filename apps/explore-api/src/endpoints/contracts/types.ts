export interface Contract {
  chainId: number;
  account: string;
  txHash: string;
  contractAddress: string;
  contractContent: string;
}

export type CreateContractDto = Contract;

export type ContractQueryParams = Partial<Contract> & {
  pageSize: number;
  pageCursor?: string;
  order?: string;
  offset?: number;
};
