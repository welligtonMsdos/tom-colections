import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, tap } from 'rxjs';
import { VinylCarouselAlbum } from '../../../domain/vinyl-carousel.model';
import { VinylService } from '../../../service/vinyl.service';
import { VinylCarouselComponent } from '../vinyl-carousel/vinyl-carousel';

@Component({
  selector: 'app-vinyl-carousel-page',
  standalone: true,
  imports: [VinylCarouselComponent],
  templateUrl: './vinyl-carousel-page.html',
})
export class VinylCarouselPage implements OnInit {
  private readonly vinylService = inject(VinylService);
  private readonly destroyRef = inject(DestroyRef);
  private requestedPage: number = 1;

  readonly albums = signal<readonly VinylCarouselAlbum[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalPages = signal<number>(0);
  readonly hasNextPage = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly loadError = signal<boolean>(false);
  readonly selectedGuid = signal<string | undefined>(undefined);
  readonly openedGuid = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.loadAlbums(1);
  }

  loadMore(): void {
    this.loadAlbums(this.hasNextPage() ? this.page() + 1 : 1);
  }

  retry(): void {
    this.loadAlbums(this.requestedPage);
  }

  loadAlbums(page: number): void {
    if (this.isLoading()) {
      return;
    }

    this.requestedPage = page;
    this.isLoading.set(true);
    this.loadError.set(false);
    this.vinylService
      .getCarouselPage(page, this.pageSize())
      .pipe(
        tap(response => {
          const items = response.page === 1
            ? response.items
            : [...this.albums(), ...response.items];
          const uniqueAlbums = new Map<string, VinylCarouselAlbum>(
            items.map(album => [album.guid, album])
          );

          this.openedGuid.set(undefined);
          this.albums.set([...uniqueAlbums.values()]);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalPages.set(response.totalPages);
          this.hasNextPage.set(response.hasNextPage);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: () => this.loadError.set(true),
      });
  }
}