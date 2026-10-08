import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { VinylCarouselPageResponse } from '../domain/vinyl-carousel.model';
import { VinylService } from './vinyl.service';

describe('VinylService carousel pagination', () => {
  it('sends page parameters and leaves the catalog state unchanged', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(VinylService);
    const http = TestBed.inject(HttpTestingController);
    const response: VinylCarouselPageResponse = {
      items: [{ guid: 'album', photo: '' }],
      page: 2,
      pageSize: 10,
      totalItems: 20,
      totalPages: 2,
      hasNextPage: false,
    };
    const received = jasmine.createSpy('received');
    service.getCarouselPage(2, 10).subscribe(received);
    const request = http.expectOne(req =>
      req.url.endsWith('/api/Vinyls/photos')
        && req.params.get('page') === '2'
        && req.params.get('pageSize') === '10'
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    expect(received).toHaveBeenCalledOnceWith(response);
    expect(service.vinyls()).toEqual([]);
    http.verify();
  });

  for (const invalidResponse of [
    [],
    null,
    { items: null },
    {
      items: [null],
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
    },
    {
      items: [{ guid: 'album', photo: '' }],
      page: '1',
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
    },
  ]) {
    it('rejects malformed responses through the observable error handler', () => {
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      const service = TestBed.inject(VinylService);
      const http = TestBed.inject(HttpTestingController);
      const received = jasmine.createSpy('received');
      const failed = jasmine.createSpy('failed');
      service.getCarouselPage(1, 10).subscribe({
        next: received,
        error: failed,
      });
      http.expectOne(req => req.url.endsWith('/api/Vinyls/photos'))
        .flush(invalidResponse);
      expect(received).not.toHaveBeenCalled();
      expect(failed).toHaveBeenCalledTimes(1);
      expect(failed.calls.mostRecent().args[0]).toEqual(jasmine.any(Error));
      http.verify();
    });
  }
});
