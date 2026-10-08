export interface ConcertPriceByYearDto {
  year: number;
  totalPrice: number;
}

export interface ConcertDto{
  guid: string;
  artist: string;
  venue: string;
  showDate: string;
  photo: string;
  price: number;
}

export interface Concert {
  readonly guid: string;
  artist: string;
  venue: string;
  showDate: string;
  photo: string;
  price: number;
}

export type ConcertCreateDto = Omit<Concert, 'guid'>;
export type ConcertUpdateDto = Omit<Concert, 'guid'>;
