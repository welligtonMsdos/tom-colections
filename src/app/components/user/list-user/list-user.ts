import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { DeleteData } from '../../shared/delete-data/delete-data';
import { AlertService } from '../../../service/alert.service';
import { UserDto } from '../../../domain/user.model';
import { UserUpdate } from "../user-update/user-update";

@Component({
  selector: 'app-list-user',
  imports: [DeleteData, UserUpdate],
  templateUrl: './list-user.html',
  styleUrl: './list-user.css',
})
export class ListUser implements OnInit {

  private alert = inject(AlertService);
  protected userService = inject(UserService);
  protected readonly Math = Math;

  userSelected = signal<UserDto | null>(null);
  showModalUpdate = signal(false);
  showModalDelete = signal(false);
  isLoading = signal(true);
  currentPage = signal(1);
  itemsPerPage = signal(5);
  idSelected = signal('');

  constructor() {
    effect(() => {
      this.userService.searchTerm();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  editUser(id: string) {
    this.isLoading.set(true);

    this.userService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.userSelected.set(response.data);
          this.showModalUpdate.set(true);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.alert.showError('Error loading user data');
        this.isLoading.set(false);
        }
      });
    }

  paginatedUsers = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    return this.userService.filteredUsers().slice(startIndex, startIndex + this.itemsPerPage());
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.userService.filteredUsers().length / this.itemsPerPage());
    return total > 0 ? total : 1;
  });

  pageNumbers = computed(() => {
    const pages = this.totalPages();
    return Array.from({ length: pages }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.userService.get().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  delete() {
    this.isLoading.set(true);
    const id = this.idSelected();

    this.userService.delete(id).subscribe({
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
