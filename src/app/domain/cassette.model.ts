export interface Cassette {
  readonly guid: string;
  artist: string;
  album: string;
  year: number;
  photo: string;
  price: number;
}

export type CassetteCreateDto = Omit<Cassette, 'guid'>;
export type CassetteUpdateDto = Omit<Cassette, 'guid'>;
export type CassetteDto = Cassette;
