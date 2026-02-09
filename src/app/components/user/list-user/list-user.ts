import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  usuarioSelecionado = signal<UserDto | null>(null);
  exibirModalUpdate = signal(false);
  searchTerm = signal('');
  isLoading = signal(true);
  currentPage = signal(1);
  itemsPerPage = signal(5);
  exibirModal = signal(false);
  idSelecionado = signal('');

  filteredUsers = computed(() => {
  const term = this.searchTerm().toLowerCase().trim();
  const allUsers = this.userService.users() || [];

  if (!term) return allUsers;

  return allUsers.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  editarUsuario(id: string) {
    this.isLoading.set(true);

    this.userService.getUserById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.usuarioSelecionado.set(response.data);
          this.exibirModalUpdate.set(true);
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
    return this.filteredUsers().slice(startIndex, startIndex + this.itemsPerPage());
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredUsers().length / this.itemsPerPage());
    return total > 0 ? total : 1;
  });

  pageNumbers = computed(() => {
    const pages = this.totalPages();
    return Array.from({ length: pages }, (_, i) => i + 1);
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  prepararExclusao(id: string) {
    this.idSelecionado.set(id);
    this.exibirModal.set(true);
  }

  executarExclusao() {
    this.isLoading.set(true);
    const id = this.idSelecionado();

    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alert.showSuccess(response.message);
        }
        this.finalizarAcao();
      },
      error: () => {
        this.alert.showError('Erro ao excluir usuário.');
        this.finalizarAcao();
      }
    });
  }

  private finalizarAcao() {
    this.isLoading.set(false);
    this.exibirModal.set(false);
  }

}
