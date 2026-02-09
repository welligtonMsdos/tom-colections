import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Result } from '../domain/result.model';
import { VinylDto } from '../domain/vinyl.model';
import { VinylCreateDto } from '../domain/vinylCreate.model';

@Injectable({
  providedIn: 'root'
})
export class VinylService {

  private apiUrl = 'http://localhost:5012/api/';

  private vinylsSignal = signal<VinylDto[]>([]);

  readonly vinyls = computed(() => this.vinylsSignal());

  readonly totalQuantity = computed(() => this.vinylsSignal().length);

  readonly totalValue = computed(() =>
    this.vinylsSignal().reduce((acc, item) => acc + (item.price || 0), 0)
  );

  constructor(private http: HttpClient) {}

  getAll(): Observable<Result<VinylDto[]>> {
    return this.http.get<Result<VinylDto[]>>(this.apiUrl + 'Vinyls').pipe(
      tap(result => {
        if (result.success && result.data) {
          this.vinylsSignal.set(result.data);
        }
      })
    );
  }

  post(vinyl: VinylCreateDto): Observable<Result<VinylDto>> {
    return this.http.post<Result<VinylDto>>(this.apiUrl + 'Vinyls', vinyl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.vinylsSignal.update(vinyls => [...vinyls, result.data!]);
        }
      })
    )};

}
