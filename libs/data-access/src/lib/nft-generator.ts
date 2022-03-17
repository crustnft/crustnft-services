interface Image {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Layer {
  id: string;
  name: string;
  imageIds: string[];
}

export type CreateNftCollectionDto = Omit<
  NftCollectionDto,
  'id' | 'collectionCID' | 'metadataCID' | 'status' | 'createdAt'
>;

export type UpdateNftCollectionDto = Omit<
  NftCollectionDto,
  'collectionCID' | 'metadataCID' | 'createdAt' | 'status'
>;

export interface NftCollectionDto {
  id: string;

  images: Image[];
  layers: Layer[];
  layerOrder: string[];
  name: string;
  description: string;
  creator: string;

  createdAt?: string;
  status: TaskStatus;
  collectionCID?: string;
  metadataCID?: string;
}

export enum TaskStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Processing = 'processing',
  Completed = 'completed',
  Canceled = 'canceled',
}

export type NftCollectionQueryParams = Partial<NftCollectionDto> & {
  pageSize: number;
  pageCursor?: string;
};
