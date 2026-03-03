import { VinylCreateDto, VinylUpdateDto } from './../domain/vinyl.model';
import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Result } from '../domain/result.model';
import { VinylDto } from '../domain/vinyl.model';


@Injectable({
  providedIn: 'root'
})
export class VinylService {

  //private apiUrl = 'http://13.59.37.186:8081/api/Vinyls';
  private apiUrl = 'http://localhost:5012/api/Vinyls';

  private vinylsSignal = signal<VinylDto[]>([]);

  readonly vinyls = computed(() => this.vinylsSignal());

  readonly totalQuantity = computed(() => this.vinylsSignal().length);

  readonly totalValue = computed(() =>
    this.vinylsSignal().reduce((acc, item) => acc + (item.price || 0), 0)
  );

  constructor(private http: HttpClient) {}

  get(): Observable<Result<VinylDto[]>> {
    return this.http.get<Result<VinylDto[]>>(this.apiUrl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.vinylsSignal.set(result.data);
        }
      })
    );
  }

  getByGuid(guid: string): Observable<Result<VinylDto>> {
    return this.http.get<Result<VinylDto>>(this.apiUrl + `/${guid}`);
  }

  post(vinyl: VinylCreateDto): Observable<Result<VinylDto>> {
    return this.http.post<Result<VinylDto>>(this.apiUrl, vinyl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.vinylsSignal.update(vinyls => [...vinyls, result.data!]);
        }
      })
    )};

  put(vinyl: VinylUpdateDto): Observable<Result<VinylDto>> {
    return this.http.put<Result<VinylDto>>(this.apiUrl, vinyl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.vinylsSignal.update(vinyls => vinyls.map(v => v.guid === vinyl.guid ? result.data! : v));
        }
      })
    );
  }

  delete(guid: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(this.apiUrl + `/${guid}`).pipe(
      tap(result => {
        if (result.success) {
          this.vinylsSignal.update(vinyls => vinyls.filter(v => v.guid !== guid));
        }
      })
    );
  }

}
