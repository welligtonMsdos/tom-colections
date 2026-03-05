import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConcertService } from '../../../service/concert.service';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {

 protected concertService = inject(ConcertService);

}
