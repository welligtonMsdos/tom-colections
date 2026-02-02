import { Component, inject } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header-vinil',
  imports: [CurrencyPipe],
  templateUrl: './header-vinil.html',
  styleUrl: './header-vinil.css',
})
export class HeaderVinil {

  protected vinylService = inject(VinylService);

}
