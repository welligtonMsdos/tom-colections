import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { K7Service } from '../../../service/k7.service';

@Component({
  selector: 'app-card-k7',
  imports: [CurrencyPipe],
  templateUrl: './card-k7.html',
  styleUrl: './card-k7.css',
})
export class CardK7 {
  protected readonly k7Service = inject(K7Service);

}
