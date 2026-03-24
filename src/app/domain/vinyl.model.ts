export interface Vinyl {
  readonly guid: string;
  artist: string;
  album: string;
  year: number;
  photo: string;
  price: number;
}

export type VinylCreateDto = Omit<Vinyl, 'guid'>;
export type VinylUpdateDto = Omit<Vinyl, 'guid'>;
export type VinylDto = Vinyl;


