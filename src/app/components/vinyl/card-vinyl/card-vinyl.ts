import { Component, inject } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-vinyl',
  imports: [CurrencyPipe, MatIconModule],
  templateUrl: './card-vinyl.html',
  styleUrl: './card-vinyl.css',
})
export class CardVinyl {

  protected vinylService = inject(VinylService);

}
