import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TicketService } from '../../../service/ticket.service';
import { ConcertsService } from '../../../service/concerts.service';
@Component({
  selector: 'app-tickets',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {

 protected ticketService = inject(TicketService);

//  protected concertsService = inject(ConcertsService);

//  ngOnInit(): void {
//     this.concertsService.getAllConcerts().subscribe({
//       next: () => this.isLoading.set(false),
//       error: () => this.isLoading.set(false)
//     });
//   }

}
