export interface ConcertDto{
  guid: string;
  artist: string;
  venue: string;
  showDate: Date;
  showDateDescription: string;
  photo: string;
}

export interface Concert {
  readonly guid: string;
  artist: string;
  venue: string;
  showDate: Date;
  photo: string;
}

export type ConcertCreateDto = Omit<Concert, 'guid'>;
export type ConcertUpdateDto = Omit<Concert, 'guid'>;
