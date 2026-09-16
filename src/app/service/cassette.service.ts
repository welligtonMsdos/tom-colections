import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  CassetteCreateDto,
  CassetteDto,
  CassetteUpdateDto,
} from '../domain/cassette.model';
import { Result } from '../domain/result.model';

@Injectable({
  providedIn: 'root',
})
export class CassetteService {
  //private readonly apiUrl = 'https://collectionsproject.onrender.com/api/Cassettes';
  private readonly apiUrl = 'http://localhost:5012/api/cassettes';

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

  get(): Observable<Result<CassetteDto[]>> {
    return this.http
      .get<Result<CassetteDto[]>>(this.apiUrl)
      .pipe(
        tap((result) => {
          if (result.success && result.data) {
            this.cassettesSignal.set(result.data);
          }
        }),
      );
  }

  getByGuid(
    guid: string,
  ): Observable<Result<CassetteDto>> {
    return this.http.get<Result<CassetteDto>>(`${this.apiUrl}/${guid}`);
  }

  post(
    cassette: CassetteCreateDto,
  ): Observable<Result<CassetteDto>> {
    return this.http
      .post<Result<CassetteDto>>(this.apiUrl, cassette)
      .pipe(
        tap((result) => {
          if (result.success && result.data) {
            this.cassettesSignal.update((cassettes) => [
              ...cassettes,
              result.data,
            ]);
          }
        }),
      );
  }

  put(
    cassette: CassetteUpdateDto,
    guid: string,
  ): Observable<Result<CassetteDto>> {
    return this.http
      .put<Result<CassetteDto>>(`${this.apiUrl}/${guid}`, cassette)
      .pipe(
        tap((result) => {
          if (result.success && result.data) {
            this.cassettesSignal.update((cassettes) =>
              cassettes.map((item) =>
                item.guid === guid
                  ? result.data
                  : item,
              ),
            );
          }
        }),
      );
  }

  delete(
    guid: string,
  ): Observable<Result<void>> {
    return this.http
      .delete<Result<void>>(`${this.apiUrl}/${guid}`)
      .pipe(
        tap((result) => {
          if (result.success) {
            this.cassettesSignal.update((cassettes) =>
              cassettes.filter((cassette) => cassette.guid !== guid),
            );
          }
        }),
      );
  }
}
