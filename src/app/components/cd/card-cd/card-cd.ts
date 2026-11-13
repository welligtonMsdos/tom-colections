import { Component, inject } from '@angular/core';
import { CdService } from '../../../service/cd.service';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-cd',
  imports: [CurrencyPipe, MatIconModule],
  templateUrl: './card-cd.html',
  styleUrl: './card-cd.css',
})
export class CardCd {

  protected cdService = inject(CdService);

}
