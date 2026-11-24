import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionPath } from '../domain/collection-path.model';
import { SKIP_AUTH } from './auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class CollectionPathService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://theband-qv3s.onrender.com/api/collections/paths';

  getPaths(): Observable<CollectionPath[]> {
    return this.http.get<CollectionPath[]>(this.apiUrl, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }
}
