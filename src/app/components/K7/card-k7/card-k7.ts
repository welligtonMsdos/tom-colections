import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CassetteService } from '../../../service/cassette.service';

@Component({
  selector: 'app-card-k7',
  imports: [CurrencyPipe],
  templateUrl: './card-k7.html',
  styleUrl: './card-k7.css',
})
export class CardK7 {
  protected readonly cassetteService = inject(CassetteService);

}
