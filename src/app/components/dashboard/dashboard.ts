import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ConcertPriceByYearDto } from '../../domain/concert.model';
import { VinylDto } from '../../domain/vinyl.model';
import { ConcertService } from '../../service/concert.service';
import { VinylService } from '../../service/vinyl.service';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly vinylService = inject(VinylService);
  private readonly concertService = inject(ConcertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly concertPricesByYear = signal<ConcertPriceByYearDto[]>([]);
  readonly isConcertLoading = signal<boolean>(true);
  readonly concertLoadError = signal<boolean>(false);
  readonly totalSpent = computed<number>(() =>
    this.concertPricesByYear().reduce(
      (total, item) => total + Math.round(item.totalPrice * 100),
      0
    ) / 100
  );

  readonly mostExpensive = signal<VinylDto[]>([]);
  readonly cheapest = signal<VinylDto[]>([]);
  readonly isLoading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void {
    this.concertService
      .getPriceByYear()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pricesByYear) => {
          this.concertPricesByYear.set(
            [...pricesByYear].sort((first, second) => first.year - second.year)
          );
          this.isConcertLoading.set(false);
        },
        error: () => {
          this.concertLoadError.set(true);
          this.isConcertLoading.set(false);
        },
      });

    forkJoin({
      mostExpensive: this.vinylService.getMostExpensive(),
      cheapest: this.vinylService.getThreeCheapest(),
    }).subscribe({
      next: ({ mostExpensive, cheapest }) => {
        this.mostExpensive.set(mostExpensive);
        this.cheapest.set(cheapest);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
