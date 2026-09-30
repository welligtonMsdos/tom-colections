import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { VinylDto } from '../../domain/vinyl.model';
import { VinylService } from '../../service/vinyl.service';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly vinylService = inject(VinylService);

  readonly mostExpensive = signal<VinylDto[]>([]);
  readonly cheapest = signal<VinylDto[]>([]);
  readonly isLoading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void {
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
