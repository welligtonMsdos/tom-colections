import { Component, computed, inject, signal } from '@angular/core';
import { UserCreate } from "../user-create/user-create";
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-header-user',
  imports: [UserCreate],
  templateUrl: './header-user.html',
  styleUrl: './header-user.css',
})
export class HeaderUser {

  showModalCreate = signal(false);

  currentPage = signal(1);

  protected userService = inject(UserService);

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.userService.searchTerm.set(value);
  }

}
