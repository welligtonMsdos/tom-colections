import { VinylService } from '../../../service/vinyl.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { VinylCreate } from "../vinyl-create/vinyl-create";
@Component({
  selector: 'app-list-vinyl',
  imports: [CurrencyPipe, VinylCreate],
  templateUrl: './list-vinyl.html',
  styleUrl: './list-vinyl.css',
})
export class ListVinyl implements OnInit{

 protected readonly Math = Math;

 isLoading = signal(true);

 showModal = signal(false);

 currentPage = signal(1);

 itemsPerPage = signal(5);

 searchTerm = signal('');

 protected vinylService = inject(VinylService);

 filteredVinyls = computed(() => {
  const term = this.searchTerm().toLowerCase().trim();
  const allVinyls = this.vinylService.vinyls() || [];

  if (!term) return allVinyls;

  return allVinyls.filter(vinyl =>
      {}
    );
  });

 paginatedVinyls = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredVinyls().slice(startIndex, startIndex + this.itemsPerPage());
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredVinyls().length / this.itemsPerPage());
    return total > 0 ? total : 1;
  });

  pageNumbers = computed(() => {
    const pages = this.totalPages();
    return Array.from({ length: pages }, (_, i) => i + 1);
  });

 ngOnInit(): void {
    this.vinylService.getAll().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

}
