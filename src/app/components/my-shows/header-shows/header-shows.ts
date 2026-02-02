import { Component} from '@angular/core';
import { TicketService } from '../../../service/ticket.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header-shows',
  imports: [CommonModule],
  templateUrl: './header-shows.html',
  styleUrl: './header-shows.css',
})
export class HeaderShows {

  constructor(public ticketService: TicketService) {}

  changeFilter(type: 'upcoming' | 'past') {
    this.ticketService.updateFilter(type);
  }

}
