import { Component, signal } from '@angular/core';
import { UserCreate } from "../user-create/user-create";

@Component({
  selector: 'app-header-user',
  imports: [UserCreate],
  templateUrl: './header-user.html',
  styleUrl: './header-user.css',
})
export class HeaderUser {

  showModalCreate = signal(false);

}
