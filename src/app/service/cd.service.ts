import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  CdCreateDto,
  CdDto,
  CdUpdateDto,
} from '../domain/cd.model';

@Injectable({
  providedIn: 'root',
})
export class CdService {
  private readonly apiUrl = 'https://theband-qv3s.onrender.com/api/CDs';

  private readonly cdsSignal = signal<CdDto[]>([]);

  readonly searchTerm = signal<string>('');

  readonly cds = computed(() => this.cdsSignal());

  readonly totalQuantity = computed(() => this.cdsSignal().length);

  readonly totalValue = computed(() =>
    this.cdsSignal().reduce(
      (total, cd) => total + (cd.price || 0),
      0,
    ),
  );

  constructor(
    private readonly http: HttpClient,
  ) {}

  get(): Observable<CdDto[]> {
    return this.http
      .get<CdDto[]>(this.apiUrl)
      .pipe(
        tap((cds) => {
          this.cdsSignal.set(cds);
        }),
      );
  }

  getByGuid(
    guid: string,
  ): Observable<CdDto> {
    return this.http.get<CdDto>(`${this.apiUrl}/${guid}`);
  }

  post(
    cd: CdCreateDto,
  ): Observable<CdDto> {
    return this.http
      .post<CdDto>(this.apiUrl, cd)
      .pipe(
        tap((createdCd) => {
          this.cdsSignal.update((cds) => [
            ...cds,
            createdCd,
          ]);
        }),
      );
  }

  put(
    cd: CdUpdateDto,
    guid: string,
  ): Observable<CdDto> {
    return this.http
      .put<CdDto>(`${this.apiUrl}/${guid}`, cd)
      .pipe(
        tap((updatedCd) => {
          this.cdsSignal.update((cds) =>
            cds.map((item) =>
              item.guid === guid
                ? updatedCd
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
          this.cdsSignal.update((cds) =>
            cds.filter((cd) => cd.guid !== guid),
          );
        }),
      );
  }
}
