import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CdDto } from '../../../domain/cd.model';
import { CdService } from '../../../service/cd.service';
import { AlertService } from '../../../service/alert.service';
import { DeleteData } from '../../shared/delete-data/delete-data';
import { CdUpdate } from '../cd-update/cd-update';

@Component({
  selector: 'app-list-cd',
  imports: [CurrencyPipe, DeleteData, CdUpdate],
  templateUrl: './list-cd.html',
  styleUrl: './list-cd.css',
})
export class ListCd implements OnInit {
  protected readonly Math = Math;
  private readonly alert = inject(AlertService);
  protected readonly cdService = inject(CdService);

  readonly isLoading = signal(true);
  readonly loadError = signal(false);
  readonly showModalUpdate = signal(false);
  readonly showModalDelete = signal(false);
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(8);
  readonly searchTerm = this.cdService.searchTerm;
  readonly idSelected = signal('');
  readonly cdSelected = signal<CdDto | null>(null);

  readonly filteredCds = computed(() => {
    const term: string = this.searchTerm().toLowerCase().trim();
    const cds: CdDto[] = this.cdService.cds();

    if (!term) {
      return cds;
    }

    return cds.filter(cd =>
      cd.album.toLowerCase().includes(term)
      || cd.artist.toLowerCase().includes(term)
    );
  });

  readonly paginatedCds = computed(() => {
    const startIndex: number = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredCds().slice(startIndex, startIndex + this.itemsPerPage());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredCds().length / this.itemsPerPage()))
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1)
  );

  constructor() {
    effect(() => {
      this.searchTerm();
      this.currentPage.set(1);
    });

    effect(() => {
      const lastPage: number = this.totalPages();
      if (this.currentPage() > lastPage) {
        this.currentPage.set(lastPage);
      }
    });
  }

  ngOnInit(): void {
    this.loadCds();
  }

  loadCds(): void {
    this.isLoading.set(true);
    this.loadError.set(false);
    this.cdService.get().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  editCd(guid: string): void {
    this.isLoading.set(true);
    this.cdService.getByGuid(guid).subscribe({
      next: (cd: CdDto) => {
        this.cdSelected.set(cd);
        this.showModalUpdate.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.alert.showError('Não foi possível carregar os dados do CD.');
        this.isLoading.set(false);
      },
    });
  }

  delete(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.cdService.delete(this.idSelected()).subscribe({
      next: () => {
        this.alert.showSuccess('CD excluído com sucesso!');
        this.isLoading.set(false);
        this.showModalDelete.set(false);
      },
      error: () => {
        this.alert.showError('Não foi possível excluir o CD.');
        this.isLoading.set(false);
      },
    });
  }
}
