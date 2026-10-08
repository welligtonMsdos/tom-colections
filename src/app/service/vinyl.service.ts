import { VinylCreateDto, VinylUpdateDto } from './../domain/vinyl.model';
import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { VinylDto } from '../domain/vinyl.model';
import {
  VinylCarouselAlbum,
  VinylCarouselPageResponse,
} from '../domain/vinyl-carousel.model';


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

  getCarouselPage(
    page: number,
    pageSize: number = 10
  ): Observable<VinylCarouselPageResponse> {
    return this.http.get<unknown>(`${this.apiUrl}/photos`, {
      params: {
        page,
        pageSize,
      },
    }).pipe(
      map(response => this.parseCarouselPage(response))
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


  private parseCarouselPage(response: unknown): VinylCarouselPageResponse {
    if (
      typeof response !== 'object'
      || response === null
      || !('items' in response)
      || !Array.isArray(response.items)
      || !('page' in response)
      || typeof response.page !== 'number'
      || !Number.isInteger(response.page)
      || response.page < 1
      || !('pageSize' in response)
      || typeof response.pageSize !== 'number'
      || !Number.isInteger(response.pageSize)
      || response.pageSize < 1
      || !('totalItems' in response)
      || typeof response.totalItems !== 'number'
      || !Number.isInteger(response.totalItems)
      || response.totalItems < 0
      || !('totalPages' in response)
      || typeof response.totalPages !== 'number'
      || !Number.isInteger(response.totalPages)
      || response.totalPages < 0
      || !('hasNextPage' in response)
      || typeof response.hasNextPage !== 'boolean'
    ) {
      throw new Error('A API não retornou uma página válida de álbuns.');
    }

    const items: readonly unknown[] = response.items;
    if (!items.every(album => this.isCarouselAlbum(album))) {
      throw new Error('A API retornou um álbum inválido.');
    }

    return {
      items,
      page: response.page,
      pageSize: response.pageSize,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
    };
  }

  private isCarouselAlbum(album: unknown): album is VinylCarouselAlbum {
    return typeof album === 'object'
      && album !== null
      && 'guid' in album
      && typeof album.guid === 'string'
      && (
        ('photo' in album && typeof album.photo === 'string')
        || ('foto' in album && typeof album.foto === 'string')
      );
  }
}
