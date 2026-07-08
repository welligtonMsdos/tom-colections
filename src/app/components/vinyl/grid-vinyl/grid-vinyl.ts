import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { CurrencyPipe } from '@angular/common';
import { DeleteData } from '../../shared/delete-data/delete-data';
import { VinylUpdate } from '../vinyl-update/vinyl-update';
import { VinylDto } from '../../../domain/vinyl.model';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-grid-vinyl',
  imports: [CurrencyPipe,DeleteData, VinylUpdate],
  templateUrl: './grid-vinyl.html',
  styleUrl: './grid-vinyl.css',
})
export class GridVinyl implements OnInit{

   showModalUpdate = signal(false);
   showModalDelete = signal(false);   
   isLoading = signal(true);
   currentPage = signal(1);
   itemsPerPage = signal(8);
   idSelected = signal('');
   vinylSelected = signal<VinylDto | null>(null);
   private alert = inject(AlertService);
   protected vinylService = inject(VinylService);
   searchTerm = this.vinylService.searchTerm;

  filteredVinyls = computed(() => {   
    const term = this.searchTerm().toLowerCase().trim();
    const allVinyls = this.vinylService.vinyls() || [];

    if (!term) return allVinyls;

    return allVinyls.filter(vinyl =>
       vinyl.album.toLowerCase().includes(term) ||
       vinyl.artist.toLowerCase().includes(term)
     );
  });

  constructor() {    
    effect(() => {
      this.searchTerm();
      this.currentPage.set(1); 
    });
  }

  paginatedVinyls = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredVinyls().slice(startIndex, startIndex + this.itemsPerPage());
  });

  ngOnInit(): void {
    this.vinylService.get().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  totalPages = computed(() => {
    return Math.ceil(this.filteredVinyls().length / this.itemsPerPage());
  });

  pagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  goToPage(page: number): void {
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
