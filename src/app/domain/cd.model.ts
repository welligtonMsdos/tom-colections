export interface Cd {
  readonly guid: string;
  artist: string;
  album: string;
  year: number;
  photo: string;
  price: number;
}

export type CdCreateDto = Omit<Cd, 'guid'>;
export type CdUpdateDto = Omit<Cd, 'guid'>;
export type CdDto = Cd;
