import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CollectionPath } from '../../../domain/collection-path.model';
import { CollectionPathService } from '../../../service/collection-path.service';

@Component({
  selector: 'app-collection-gallery',
  templateUrl: './collection-gallery.html',
  styleUrl: './collection-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionGallery {
  readonly paths = signal<CollectionPath[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly animationDuration = computed(
    () => `${Math.max(24, Math.ceil(this.paths().length / 2) * 6)}s`,
  );

  private readonly collectionPathService = inject(CollectionPathService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.loadPaths();
  }

  loadPaths(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.collectionPathService
      .getPaths()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (paths) => {
          const validPaths = paths.filter(
            (item) =>
              !!item.path &&
              ['cd', 'vinyl', 'cassette'].includes(item.tag),
          );

          this.paths.set(this.shuffle(validPaths));
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  private shuffle(paths: CollectionPath[]): CollectionPath[] {
    const shuffled = [...paths];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  }
}
