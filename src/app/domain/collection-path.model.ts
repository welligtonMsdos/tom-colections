export type CollectionMedia = 'cd' | 'vinyl' | 'cassette';

export interface CollectionPath {
  path: string;
  tag: CollectionMedia;
}
