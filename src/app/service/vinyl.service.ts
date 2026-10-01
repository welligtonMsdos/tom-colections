import { VinylCreateDto, VinylUpdateDto } from './../domain/vinyl.model';
import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { VinylDto } from '../domain/vinyl.model';


@Injectable({
  providedIn: 'root'
})
export class VinylService {

  //private apiUrl = 'https://collectionsproject.onrender.com/api/Vinyls';
  //private apiUrl = 'http://localhost:5002/api/Vinyls';
  private apiUrl = 'https://theband-qv3s.onrender.com/api/Vinyls';

  private vinylsSignal = signal<VinylDto[]>([]);

  searchTerm = signal<string>('');

  readonly vinyls = computed(() => this.vinylsSignal());

  readonly totalQuantity = computed(() => this.vinylsSignal().length);

  readonly totalValue = computed(() =>
    this.vinylsSignal().reduce((acc, item) => acc + (item.price || 0), 0)
  );

  constructor(private http: HttpClient) {}

  get(): Observable<VinylDto[]> {
    return this.http.get<VinylDto[]>(this.apiUrl).pipe(
      tap((vinyls) => {
        this.vinylsSignal.set(vinyls);
      })
    );
  }

  getMostExpensive(): Observable<VinylDto[]> {
    return this.http.get<VinylDto[]>(`${this.apiUrl}/most-expensive`);
  }

  getThreeCheapest(): Observable<VinylDto[]> {
    return this.http.get<VinylDto[]>(`${this.apiUrl}/three-cheapest`);
  }

  getByGuid(guid: string): Observable<VinylDto> {
    return this.http.get<VinylDto>(this.apiUrl + `/${guid}`);
  }

  post(vinyl: VinylCreateDto): Observable<VinylDto> {
    return this.http.post<VinylDto>(this.apiUrl, vinyl).pipe(
      tap((createdVinyl) => {
        this.vinylsSignal.update((vinyls) => [
          ...vinyls,
          createdVinyl,
        ]);
      })
    );
  }

  put(vinyl: VinylUpdateDto, guid: string): Observable<VinylDto> {
    return this.http.put<VinylDto>(this.apiUrl + `/${guid}`, vinyl).pipe(
      tap((updatedVinyl) => {
        this.vinylsSignal.update((vinyls) =>
          vinyls.map((currentVinyl) =>
            currentVinyl.guid === guid ? updatedVinyl : currentVinyl
          )
        );
      })
    );
  }

  delete(guid: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${guid}`).pipe(
      tap(() => {
        this.vinylsSignal.update((vinyls) =>
          vinyls.filter((vinyl) => vinyl.guid !== guid)
        );
      })
    );
  }

}
