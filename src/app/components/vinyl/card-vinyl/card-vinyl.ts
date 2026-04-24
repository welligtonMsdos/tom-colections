import { Component, inject } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-vinyl',
  imports: [CurrencyPipe],
  templateUrl: './card-vinyl.html',
  styleUrl: './card-vinyl.css',
})
export class CardVinyl {

  protected vinylService = inject(VinylService);

}
