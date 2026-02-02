import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Result } from '../domain/result.model';
import { ConcertDto } from '../domain/concert.model';

@Injectable({
  providedIn: 'root'
})
export class ConcertsService {

  private apiUrl = 'http://localhost:5012/api/';

  private concertSignal = signal<ConcertDto[]>([]);

  readonly concerts = computed(() => this.concertSignal());

  constructor(private http: HttpClient) {}

  getAllConcerts(): Observable<Result<ConcertDto[]>> {
    return this.http.get<Result<ConcertDto[]>>(this.apiUrl + 'Concert/GetAllConcerts').pipe(
      tap(result => {
        if (result.success && result.data) {
          this.concertSignal.set(result.data);
        }
      })
    );
  }

}
