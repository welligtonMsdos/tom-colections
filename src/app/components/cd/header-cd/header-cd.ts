import { Component, inject, signal } from '@angular/core';
import { CdService } from '../../../service/cd.service';
import { CdCreate } from '../cd-create/cd-create';

@Component({
  selector: 'app-header-cd',
  imports: [CdCreate],
  templateUrl: './header-cd.html',
  styleUrl: './header-cd.css',
})
export class HeaderCd {

  protected cdService = inject(CdService);

  showModalCreate = signal(false);

  searchTerm = this.cdService.searchTerm;

  updateSearch(term: string): void {
    this.cdService.searchTerm.set(term);
  }

}
