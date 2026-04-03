import { VinylDto } from './../../../domain/vinyl.model';
import { VinylService } from '../../../service/vinyl.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DeleteData } from '../../shared/delete-data/delete-data';
import { AlertService } from '../../../service/alert.service';
import { VinylUpdate } from '../vinyl-update/vinyl-update';
@Component({
  selector: 'app-list-vinyl',
  imports: [CurrencyPipe, DeleteData, VinylUpdate],
  templateUrl: './list-vinyl.html',
  styleUrl: './list-vinyl.css',
})
export class ListVinyl implements OnInit{

 protected readonly Math = Math;
 private alert = inject(AlertService);
 protected vinylService = inject(VinylService);

 isLoading = signal(true); 
 showModalUpdate = signal(false);
 showModalDelete = signal(false);
 currentPage = signal(1);
 itemsPerPage = signal(5);
 searchTerm = signal('');
 idSelected = signal('');
 vinylSelected = signal<VinylDto | null>(null);

  filteredVinyls = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allVinyls = this.vinylService.vinyls() || [];

    if (!term) return allVinyls;

    return allVinyls.filter(vinyl =>
       vinyl.album.toLowerCase().includes(term) ||
       vinyl.artist.toLowerCase().includes(term)
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
    this.vinylService.get().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  editVinyl(guid: string) {
    this.isLoading.set(true);

    this.vinylService.getByGuid(guid).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.vinylSelected.set(response.data);
          this.showModalUpdate.set(true);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.alert.showError('Error loading vinyl data');
        this.isLoading.set(false);
        }
      });
    }

  delete() {
    this.isLoading.set(true);

    const id = this.idSelected();

    this.vinylService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alert.showSuccess(response.message);
        }
        this.finally();
      },
      error: (err) => {
        this.alert.showError(err.error?.message);
        this.finally();
      }
    });
  }

  private finally() {
    this.isLoading.set(false);    
    this.showModalUpdate.set(false);
    this.showModalDelete.set(false);
  }

}
