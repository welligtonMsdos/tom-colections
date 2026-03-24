import { Component, signal} from '@angular/core';
import { ConcertService } from '../../../service/concert.service';
import { CommonModule } from '@angular/common';
import { ConcertCreate } from '../concert-create/concert-create';

@Component({
  selector: 'app-header-shows',
  imports: [CommonModule,
    ConcertCreate],
  templateUrl: './header-shows.html',
  styleUrl: './header-shows.css',
})
export class HeaderShows {

  showModalCreate = signal(false);

  constructor(public concertService: ConcertService) {}

  changeFilter(type: 'upcoming' | 'past') {
    this.concertService.updateFilter(type);
  }

}
