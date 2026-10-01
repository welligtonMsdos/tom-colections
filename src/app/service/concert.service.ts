import { computed, inject, Injectable, signal } from "@angular/core";
import { ConcertCreateDto, ConcertDto, ConcertUpdateDto } from "../domain/concert.model";
import { HttpClient } from "@angular/common/http";
import { catchError, finalize, Observable, of, tap } from "rxjs";
import { AlertService } from "./alert.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  //private apiUrl = 'https://collectionsproject.onrender.com/api/Concerts';
  private apiUrl = 'https://theband-qv3s.onrender.com/api/Concerts';

  private filterSignal = signal<'upcoming' | 'past'>('upcoming');

  private alert = inject(AlertService);

  public loading = signal<boolean>(false);

  private cache = new Map<string, ConcertDto[]>();

  private ticketsState = signal<ConcertDto[]>([]);

  public currentFilter = this.filterSignal.asReadonly();

  public ticketList = this.ticketsState.asReadonly();
 
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {
    this.get();
  }

  public refresh(): void {
    this.cache.clear();
    this.ticketsState.set([]);
    this.get();
  }

  updateFilter(filter: 'upcoming' | 'past'): void {
    this.filterSignal.set(filter);
    this.get();
  }

  get(): void {
    const status = this.filterSignal();   

    const token = this.authService.getToken();

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

    this.http.get<ConcertDto[]>(`${this.apiUrl}/${endpoint}`).pipe(
      tap((concerts) => {
        this.cache.set(cacheKey, concerts);
        this.ticketsState.set(concerts);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error(error);
        const backendError = error.error;
        this.alert.showError(backendError?.Errors || 'Não foi possível carregar os shows.');
        this.ticketsState.set([]);
        this.loading.set(false);
        return of([]);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

   getByGuid(guid: string): Observable<ConcertDto> {
      return this.http.get<ConcertDto>(this.apiUrl + `/${guid}`);
  }

  post(concert: ConcertCreateDto): Observable<ConcertDto> {
      return this.http.post<ConcertDto>(this.apiUrl, concert).pipe(
        tap(() => {
          this.refresh();
        })
      )};

  put(concert: ConcertUpdateDto, guid: string): Observable<ConcertDto> {
      return this.http.put<ConcertDto>(this.apiUrl + `/${guid}`, concert).pipe(
        tap(() => {
          this.refresh();
        })
      );
    }

  delete(guid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${guid}`).pipe(
      tap(() => {
        this.refresh();
      })
    );
  }

}
