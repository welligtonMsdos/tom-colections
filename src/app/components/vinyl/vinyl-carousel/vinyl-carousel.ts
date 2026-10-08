import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { VinylCarouselAlbum } from '../../../domain/vinyl-carousel.model';

@Component({
  selector: 'app-vinyl-carousel',
  standalone: true,
  templateUrl: './vinyl-carousel.html',
  styleUrl: './vinyl-carousel.scss',
})
export class VinylCarouselComponent implements OnChanges {
  @Input() albums: readonly VinylCarouselAlbum[] = [];
  @Output() readonly albumClick = new EventEmitter<string>();
  @Output() readonly selectionChange = new EventEmitter<string>();

  activeIndex: number = 0;
  dragOffset: number = 0;

  private activeGuid: string | undefined;
  private readonly failedPhotos = new Map<string, string>();
  private pointerId: number | undefined;
  private startX: number = 0;
  private startY: number = 0;
  private horizontalGesture: boolean = false;
  private suppressClick: boolean = false;

  ngOnChanges(): void {
    this.cancelGesture();
    for (const [guid, url] of this.failedPhotos) {
      if (!this.albums.some(album =>
        album.guid === guid && this.photoUrl(album) === url
      )) {
        this.failedPhotos.delete(guid);
      }
    }

    const retainedIndex = this.albums.findIndex(
      album => album.guid === this.activeGuid
    );
    this.activeIndex = retainedIndex >= 0 ? retainedIndex : 0;
    this.updateSelection();
  }

  photoUrl(album: VinylCarouselAlbum): string {
    return album.foto ?? album.photo ?? '';
  }

  hasPhoto(album: VinylCarouselAlbum): boolean {
    const url = this.photoUrl(album);
    return Boolean(url) && this.failedPhotos.get(album.guid) !== url;
  }

  photoFailed(album: VinylCarouselAlbum): void {
    this.failedPhotos.set(album.guid, this.photoUrl(album));
  }

  itemTransform(index: number): string {
    const offset = index - this.activeIndex;
    const angle = offset === 0 ? 0 : (offset < 0 ? 14 : -14);
    const scale = offset === 0 ? 1 : 0.78;
    return `translate(calc(-50% + ${offset * 132}% + ${this.dragOffset}px), -50%) `
      + `perspective(900px) rotateY(${angle}deg) scale(${scale})`;
  }

  isNearby(index: number): boolean {
    return Math.abs(index - this.activeIndex) <= 1;
  }

  select(index: number): void {
    if (index < 0 || index >= this.albums.length) {
      return;
    }
    this.activeIndex = index;
    this.updateSelection();
  }

  onAlbumClick(index: number, event: MouseEvent): void {
    if (this.suppressClick && event.detail !== 0) {
      this.suppressClick = false;
      return;
    }
    if (index !== this.activeIndex) {
      this.select(index);
      return;
    }
    const album = this.albums[index];
    if (album) {
      this.albumClick.emit(album.guid);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = this.activeIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = this.activeIndex + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = this.albums.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(nextIndex);
    const region = event.currentTarget as HTMLElement;
    region.querySelectorAll<HTMLButtonElement>(
      '.vinyl-carousel__album'
    )[this.activeIndex]?.focus({ preventScroll: true });
  }

  onPointerDown(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0 || this.albums.length < 2) {
      return;
    }
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.horizontalGesture = false;
    this.suppressClick = false;
  }

  onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    if (!this.horizontalGesture) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) {
        return;
      }
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        this.cancelGesture();
        return;
      }
      this.horizontalGesture = true;
      this.suppressClick = true;
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    this.dragOffset = Math.max(-80, Math.min(80, deltaX));
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    const deltaX = event.clientX - this.startX;
    const swipeThreshold = Math.max(
      24,
      Math.min(32, target.clientWidth * 0.08)
    );
    const shouldSelect = this.horizontalGesture
      && Math.abs(deltaX) >= swipeThreshold;
    this.cancelGesture();
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    if (shouldSelect) {
      this.select(this.activeIndex + (deltaX < 0 ? 1 : -1));
    }
  }


  onLostPointerCapture(event: PointerEvent): void {
    if (
      event.target === event.currentTarget
      && event.pointerId === this.pointerId
    ) {
      this.cancelGesture();
    }
  }
  cancelGesture(): void {
    this.pointerId = undefined;
    this.horizontalGesture = false;
    this.dragOffset = 0;
  }

  private updateSelection(): void {
    const guid = this.albums[this.activeIndex]?.guid;
    if (guid === this.activeGuid) {
      return;
    }
    this.activeGuid = guid;
    if (guid !== undefined) {
      this.selectionChange.emit(guid);
    }
  }
}