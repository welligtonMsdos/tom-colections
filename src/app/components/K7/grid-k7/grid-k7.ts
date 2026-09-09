import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { K7Service } from '../../../service/k7.service';

@Component({
  selector: 'app-grid-k7',
  imports: [CurrencyPipe],
  templateUrl: './grid-k7.html',
  styleUrl: './grid-k7.css',
})
export class GridK7 {
  protected readonly Math = Math;
  private readonly k7Service = inject(K7Service);

  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = signal(10);
  protected readonly searchTerm = this.k7Service.searchTerm;

  protected readonly filteredK7s = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.k7Service.k7s();
    return term ? items.filter(item => item.album.toLowerCase().includes(term) || item.artist.toLowerCase().includes(term)) : items;
  });

  protected readonly paginatedK7s = computed(() => {
    const first = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredK7s().slice(first, first + this.itemsPerPage());
  });

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredK7s().length / this.itemsPerPage())));
  protected readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  constructor() {
    effect(() => {
      this.searchTerm();
      this.currentPage.set(1);
    });
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

}
