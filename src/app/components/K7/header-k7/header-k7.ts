import { Component, inject } from '@angular/core';
import { K7Service } from '../../../service/k7.service';

@Component({
  selector: 'app-header-k7',
  imports: [],
  templateUrl: './header-k7.html',
  styleUrl: './header-k7.css',
})
export class HeaderK7 {
  private readonly k7Service = inject(K7Service);

  protected readonly searchTerm = this.k7Service.searchTerm;

  protected updateSearch(term: string): void {
    this.k7Service.searchTerm.set(term);
  }

}
