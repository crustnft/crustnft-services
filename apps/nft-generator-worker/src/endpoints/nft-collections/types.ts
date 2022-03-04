export interface NftGeneratorDto {
  id: string;
}
export interface NftCollection {
  id: string;
  status: string;
  medias: Media[];
}

interface Media {
  category: string;
  mediaId: string;
}
