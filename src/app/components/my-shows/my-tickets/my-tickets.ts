import { Component, inject, OnInit } from '@angular/core';
import { ConcertService } from '../../../service/concert.service';

@Component({
  selector: 'app-my-tickets',
  imports: [],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
})
export class MyTickets implements OnInit {

  protected concertService = inject(ConcertService);

   ngOnInit(): void {    

    this.concertService.updateFilter('past');

    this.concertService.get();
 }

}
