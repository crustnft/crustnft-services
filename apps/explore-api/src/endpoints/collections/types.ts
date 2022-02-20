export interface Collection {
  account: string;
  id: string;
  socialUrls?: string[];
  avatarUrl?: string;
  coverUrl?: string;
  description?: string;
}

export type CreateCollectionDto = Collection;
export type UpdateCollectionDto = Collection;

export type CollectionQueryParams = Partial<Collection> & {
  pageSize: number;
  pageCursor?: string;
};
