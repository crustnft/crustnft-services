interface Media {
  category: string;
  mediaId: string;
}

export interface CreateNftGeneratorDto {
  medias: Media[];
}

export interface NftGeneratorDto {
  id: string;
  status: string;
  medias: Media[];
}

export enum TaskStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Processing = 'processing',
  Completed = 'completed',
  Canceled = 'canceled',
}
