import { Component, inject } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header-vinyl',
  imports: [CurrencyPipe],
  templateUrl: './header-vinyl.html',
  styleUrl: './header-vinyl.css',
})
export class HeaderVinyl {

  protected vinylService = inject(VinylService);

}
