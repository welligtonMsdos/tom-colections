import { Component, inject, signal } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { VinylCreate } from '../vinyl-create/vinyl-create';

@Component({
  selector: 'app-header-vinyl',
  imports: [VinylCreate],
  templateUrl: './header-vinyl.html',
})
export class HeaderVinyl {

  protected vinylService = inject(VinylService);

  showModalCreate = signal(false);

  searchTerm = this.vinylService.searchTerm;

  updateSearch(term: string): void {
    this.vinylService.searchTerm.set(term);
  }

}
