export interface ContractDto {
  chainId: number;
  creator: string;
  txHash: string;
  contractAddress: string;
  contractContent: string;
  published: boolean;
  collectionType: 'expandable' | 'cryptopunks';
}

export type CreateContractDto = ContractDto;
export type UpdateContractDto = Pick<ContractDto, 'txHash' | 'published'>;

export type ContractQueryParams = Partial<ContractDto> & {
  pageSize: number;
  pageCursor?: string;
  order?: string;
  offset?: number;
  countOnly?: 'true' | 'false';
};
