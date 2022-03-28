export interface ContractDto {
  id: string;
  chainId: number;
  creator: string;
  contractAddress: string;
  contractContent: string;
  published: boolean;
  collectionType: 'expandable' | 'cryptopunks';
}

export type CreateContractDto = ContractDto;
export type UpdateContractDto = Pick<ContractDto, 'id' | 'published'>;

export type ContractQueryParams = Partial<ContractDto> & {
  pageSize: number;
  pageCursor?: string;
  order?: string;
  offset?: number;
  countOnly?: 'true' | 'false';
};
