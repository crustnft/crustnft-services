export interface Collection {
  account: string;
  id: string;
  socialUrls?: string[];
  avatarCID?: string;
  coverCID?: string;
  description?: string;
}

export type CreateCollectionDto = Collection;
export type UpdateCollectionDto = Collection;

export type CollectionQueryParams = Partial<Collection> & {
  pageSize: number;
  pageCursor?: string;
  order?: string;
};
