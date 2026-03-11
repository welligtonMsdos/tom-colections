import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConcertService } from '../../../service/concert.service';
import { ConcertDto } from '../../../domain/concert.model';
import { AlertService } from '../../../service/alert.service';
import { ConcertUpdate } from "../concert-update/concert-update";
import { DeleteData } from '../../shared/delete-data/delete-data';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule,
            MatCardModule,
            MatIconModule,
            ConcertUpdate,
            DeleteData],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {

 protected concertService = inject(ConcertService);
 private alert = inject(AlertService);
 concertSelected = signal<ConcertDto | null>(null);
 showModalUpdate = signal(false);
 showModalDelete = signal(false);
 isLoading = signal(true);
 idSelected = signal('');

 ngOnInit(): void {
    this.concertService.get();
 }

 editConcert(guid: string) {
    this.isLoading.set(true);

    this.concertService.getByGuid(guid).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.concertSelected.set(response.data);
          this.showModalUpdate.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
          this.alert.showError(err.error?.message);
          this.isLoading.set(false);
        }
      });
    }

  delete() {
    this.isLoading.set(true);

    const id = this.idSelected();

    this.concertService.delete(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.alert.showSuccess(response.message);
        }
        this.finally();
      },
      error: (err) => {
        this.alert.showError(err.error?.message);
        this.finally();
      }
    });
  }

  private finally() {
    this.isLoading.set(false);
    this.showModalUpdate.set(false);
    this.showModalDelete.set(false);
  }

}
