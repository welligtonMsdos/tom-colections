import { computed, Injectable, signal } from "@angular/core";
import { ConcertDto } from "../domain/concert.model";
import { Result } from "../domain/result.model";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:5012/api/Concerts/';

  private filterSignal = signal<'upcoming' | 'past'>('upcoming');

  public loading = signal<boolean>(false);

  private cache = new Map<string, Result<ConcertDto[]>>();

  private ticketsState = signal<Result<ConcertDto[]>>({
    data: [],
    success: true,
    message: '',
    errors: {}
  });

  public currentFilter = this.filterSignal.asReadonly();

  public ticketList = computed(() => this.ticketsState().data);

  constructor(private http: HttpClient) {
    this.loadTickets();
  }

  updateFilter(filter: 'upcoming' | 'past') {
    this.filterSignal.set(filter);
    this.loadTickets();
  }

  loadTickets() {
    const status = this.filterSignal();

    if (this.cache.has(status)) {
      this.ticketsState.set(this.cache.get(status)!);
      return;
    }

    this.loading.set(true);

    const endpoint = status === 'past' ? 'Past' : 'Upcomming';

    this.http.get<Result<ConcertDto[]>>(`${this.apiUrl}${endpoint}`).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.set(status, result);
          this.ticketsState.set(result);
        }
        this.loading.set(false);
      })
    ).subscribe();
  }

  addShowLocally(newShow: ConcertDto) {
    this.ticketsState.update(state => ({
      ...state,
      data: [newShow, ...state.data]
    }));
  }
}
