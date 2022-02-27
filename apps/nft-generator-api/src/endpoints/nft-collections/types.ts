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
