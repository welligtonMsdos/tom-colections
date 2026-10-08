export type VinylCarouselAlbum = {
  readonly guid: string;
} & (
  | { readonly foto: string; readonly photo?: string }
  | { readonly photo: string; readonly foto?: string }
);

export interface VinylCarouselPageResponse {
  readonly items: readonly VinylCarouselAlbum[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
}