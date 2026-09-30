import { Component, inject } from '@angular/core';
import { CassetteService } from '../../../service/cassette.service';

@Component({
  selector: 'app-header-k7',
  imports: [],
  templateUrl: './header-k7.html',
  styleUrl: './header-k7.css',
})
export class HeaderK7 {
  private readonly cassetteService = inject(CassetteService);

  protected readonly searchTerm = this.cassetteService.searchTerm;

  protected updateSearch(term: string): void {
    this.cassetteService.searchTerm.set(term);
  }

}
