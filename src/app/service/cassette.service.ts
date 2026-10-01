import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  CassetteCreateDto,
  CassetteDto,
  CassetteUpdateDto,
} from '../domain/cassette.model';

@Injectable({
  providedIn: 'root',
})
export class CassetteService {
  //private readonly apiUrl = 'https://collectionsproject.onrender.com/api/Cassettes';
private readonly apiUrl = 'https://theband-qv3s.onrender.com/api/cassettes';

  private readonly cassettesSignal = signal<CassetteDto[]>([]);

  readonly searchTerm = signal<string>('');

  readonly cassettes = computed(() => this.cassettesSignal());

  readonly totalQuantity = computed(() => this.cassettesSignal().length);

  readonly totalValue = computed(() =>
    this.cassettesSignal().reduce(
      (total, cassette) => total + (cassette.price || 0),
      0,
    ),
  );

  constructor(
    private readonly http: HttpClient,
  ) {}

  get(): Observable<CassetteDto[]> {
    return this.http
      .get<CassetteDto[]>(this.apiUrl)
      .pipe(
        tap((cassettes) => {
          this.cassettesSignal.set(cassettes);
        }),
      );
  }

  getByGuid(
    guid: string,
  ): Observable<CassetteDto> {
    return this.http.get<CassetteDto>(`${this.apiUrl}/${guid}`);
  }

  post(
    cassette: CassetteCreateDto,
  ): Observable<CassetteDto> {
    return this.http
      .post<CassetteDto>(this.apiUrl, cassette)
      .pipe(
        tap((createdCassette) => {
          this.cassettesSignal.update((cassettes) => [
            ...cassettes,
            createdCassette,
          ]);
        }),
      );
  }

  put(
    cassette: CassetteUpdateDto,
    guid: string,
  ): Observable<CassetteDto> {
    return this.http
      .put<CassetteDto>(`${this.apiUrl}/${guid}`, cassette)
      .pipe(
        tap((updatedCassette) => {
          this.cassettesSignal.update((cassettes) =>
            cassettes.map((item) =>
              item.guid === guid
                ? updatedCassette
                : item,
            ),
          );
        }),
      );
  }

  delete(
    guid: string,
  ): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${guid}`)
      .pipe(
        tap(() => {
          this.cassettesSignal.update((cassettes) =>
            cassettes.filter((cassette) => cassette.guid !== guid),
          );
        }),
      );
  }
}
