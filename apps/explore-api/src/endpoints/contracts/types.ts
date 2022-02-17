export interface Contract {
  chainId: number;
  account: string;
  txHash: string;
  contractAddress: string;
  contractContent: string;
}

export type CreateContractDto = Contract;
