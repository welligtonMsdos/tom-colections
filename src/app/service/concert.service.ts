import { computed, inject, Injectable, signal } from "@angular/core";
import { ConcertCreateDto, ConcertDto, ConcertUpdateDto } from "../domain/concert.model";
import { Result } from "../domain/result.model";
import { HttpClient } from "@angular/common/http";
import { catchError, finalize, Observable, tap } from "rxjs";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  //private apiUrl = 'http://13.59.37.186:8081/api/Concerts/';
  private apiUrl = 'http://localhost:5012/api/Concerts';

  private filterSignal = signal<'upcoming' | 'past'>('upcoming');

  private alert = inject(AlertService);

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

  public refresh(){
    this.cache.clear();
    this.ticketsState.set({ data: [], success: true, message: '', errors: {} });
    this.get();
  }

  updateFilter(filter: 'upcoming' | 'past') {
    this.filterSignal.set(filter);
    this.get();
  }

  get() {
    const status = this.filterSignal();

    const token = localStorage.getItem('token');

    if(!token){
      return;
    }

    const cacheKey = `${token}_${status}`;

    if (this.cache.has(cacheKey)) {
      this.ticketsState.set(this.cache.get(cacheKey)!);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    const endpoint = status === 'past' ? 'Past' : 'Upcoming';

    this.http.get<Result<ConcertDto[]>>(`${this.apiUrl}/${endpoint}`).pipe(
      tap((result) => {
        if (result.success) {
          this.cache.set(cacheKey, result);
          this.ticketsState.set(result);
        }
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error(error);
        const backendError = error.error;
        this.alert.showError(backendError.Errors);
        this.ticketsState.set({ data: [], success: false, message: 'Erro ao carregar', errors: {} });
        this.loading.set(false);
        return [];
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

   getByGuid(guid: string): Observable<Result<ConcertDto>> {
      return this.http.get<Result<ConcertDto>>(this.apiUrl + `/${guid}`);
  }

  post(concert: ConcertCreateDto): Observable<Result<ConcertDto>> {
      return this.http.post<Result<ConcertDto>>(this.apiUrl, concert).pipe(
        tap(result => {
          if (result.success && result.data) {
            this.refresh();
          }
        })
      )};

  put(concert: ConcertUpdateDto, guid: string): Observable<Result<ConcertDto>> {
      return this.http.put<Result<ConcertDto>>(this.apiUrl + `/${guid}`, concert).pipe(
        tap(result => {
          if (result.success && result.data) {
            this.refresh();
          }
        })
      );
    }

  delete(guid: string): Observable<Result<any>> {
    return this.http.delete<Result<any>>(`${this.apiUrl}/${guid}`).pipe(
      tap(result => {
        if (result.success) {
          this.refresh();
        }
      })
    );
  }

}
