import { computed, Injectable, signal } from "@angular/core";
import { ConcertCreateDto, ConcertDto } from "../domain/concert.model";
import { Result } from "../domain/result.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  //private apiUrl = 'http://13.59.37.186:8081/api/Concerts/';
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
    this.get();
  }

  updateFilter(filter: 'upcoming' | 'past') {
    this.filterSignal.set(filter);
    this.get();
  }

  get() {
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

  post(concert: ConcertCreateDto): Observable<Result<ConcertDto>> {
      return this.http.post<Result<ConcertDto>>(this.apiUrl, concert).pipe(
        tap(result => {
          if (result.success && result.data) {
            this.addShowLocally(result.data);
          }
        })
      )};

  addShowLocally(newShow: ConcertDto) {
    //const isPast = new Date(newShow.showDateDescription) < new Date();
    //const targetKey = isPast ? 'past' : 'upcoming';

    const targetKey = 'upcoming';

    if (this.filterSignal() === targetKey) {
      this.ticketsState.update(state => ({
        ...state,
        data: [newShow, ...state.data]
      }));
    }

    if (this.cache.has(targetKey)) {
     const cached = this.cache.get(targetKey)!;
     this.cache.set(targetKey, { ...cached, data: [newShow, ...cached.data] });
    }

  }
}
