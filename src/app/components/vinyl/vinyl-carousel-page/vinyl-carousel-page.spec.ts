import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { VinylCarouselPageResponse } from '../../../domain/vinyl-carousel.model';
import { VinylService } from '../../../service/vinyl.service';
import { VinylCarouselPage } from './vinyl-carousel-page';

describe('VinylCarouselPage', () => {
  const response = (
    page: number,
    hasNextPage: boolean,
    guid: string = 'album-' + page
  ): VinylCarouselPageResponse => ({
    items: [{ guid, photo: '' }],
    page,
    pageSize: 10,
    totalItems: 40,
    totalPages: 4,
    hasNextPage,
  });

  const setup = (getCarouselPage: jasmine.Spy) => {
    TestBed.configureTestingModule({
      imports: [VinylCarouselPage],
      providers: [{
        provide: VinylService,
        useValue: { getCarouselPage },
      }],
    });
    const fixture = TestBed.createComponent(VinylCarouselPage);
    fixture.detectChanges();
    fixture.detectChanges();
    return fixture;
  };

  it('loads the first page and renders Mais', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValue(of(response(1, true)));
    const fixture = setup(get);
    expect(get).toHaveBeenCalledOnceWith(1, 10);
    expect(fixture.componentInstance.selectedGuid()).toBe('album-1');
    expect((fixture.nativeElement as HTMLElement)
      .querySelector('footer button')!.textContent).toContain('Mais');
  });

  it('appends the next page and preserves the selected album', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(of(response(1, true)), of(response(2, true)));
    const fixture = setup(get);
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('footer button')!.click();
    fixture.detectChanges();
    expect(get).toHaveBeenCalledWith(2, 10);
    expect(fixture.componentInstance.albums().map(album => album.guid))
      .toEqual(['album-1', 'album-2']);
    expect(fixture.componentInstance.selectedGuid()).toBe('album-1');
    expect(fixture.componentInstance.page()).toBe(2);
  });

  it('renders Inicio on the last page and replaces the list with page one', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(
        of(response(1, true)),
        of(response(4, false)),
        of(response(1, true))
      );
    const fixture = setup(get);
    fixture.componentInstance.loadMore();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement)
      .querySelector('footer button')!.textContent).toContain('Inicio');
    const albumButtons = (fixture.nativeElement as HTMLElement)
      .querySelectorAll<HTMLButtonElement>('.vinyl-carousel__album');
    albumButtons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedGuid()).toBe('album-4');
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('footer button')!.click();
    fixture.detectChanges();
    expect(get.calls.mostRecent().args).toEqual([1, 10]);
    expect(fixture.componentInstance.albums().map(album => album.guid))
      .toEqual(['album-1']);
    expect(fixture.componentInstance.selectedGuid()).toBe('album-1');
  });

  it('deduplicates albums by GUID across pages', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(
        of(response(1, true)),
        of(response(2, false, 'album-1'))
      );
    const fixture = setup(get);
    fixture.componentInstance.loadMore();
    fixture.detectChanges();
    expect(fixture.componentInstance.albums().length).toBe(1);
    expect(fixture.componentInstance.page()).toBe(2);
  });

  it('keeps loaded albums after failure and retries the failed page', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(
        of(response(1, true)),
        throwError(() => new Error('offline')),
        of(response(2, false))
      );
    const fixture = setup(get);
    fixture.componentInstance.loadMore();
    fixture.detectChanges();
    expect(fixture.componentInstance.loadError()).toBeTrue();
    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.albums().length).toBe(1);
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.alert button')!.click();
    fixture.detectChanges();
    expect(get.calls.mostRecent().args).toEqual([2, 10]);
    expect(fixture.componentInstance.loadError()).toBeFalse();
    expect(fixture.componentInstance.albums().length).toBe(2);
  });

  it('prevents duplicate requests while loading and disables Mais', () => {
    const pending = new Subject<VinylCarouselPageResponse>();
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(of(response(1, true)), pending);
    const fixture = setup(get);
    fixture.componentInstance.loadMore();
    fixture.detectChanges();
    fixture.componentInstance.loadMore();
    expect(get).toHaveBeenCalledTimes(2);
    expect((fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('footer button')!.disabled).toBeTrue();
    expect(fixture.componentInstance.albums().length).toBe(1);
    pending.next(response(2, false));
    pending.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.isLoading()).toBeFalse();
  });

  it('retries page one after an initial error', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(
        throwError(() => new Error('offline')),
        of(response(1, false))
      );
    const fixture = setup(get);
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.alert button')!.click();
    fixture.detectChanges();
    expect(get.calls.mostRecent().args).toEqual([1, 10]);
    expect(fixture.componentInstance.albums().length).toBe(1);
  });

  it('clears loading and allows retry after an unexpected response shape', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(of([]), of(response(1, true)));
    const fixture = setup(get);
    expect(fixture.componentInstance.isLoading()).toBeFalse();
    expect(fixture.componentInstance.loadError()).toBeTrue();
    expect(fixture.componentInstance.albums()).toEqual([]);
    fixture.componentInstance.retry();
    fixture.detectChanges();
    expect(get.calls.mostRecent().args).toEqual([1, 10]);
    expect(fixture.componentInstance.isLoading()).toBeFalse();
    expect(fixture.componentInstance.loadError()).toBeFalse();
    expect(fixture.componentInstance.albums().length).toBe(1);
  });

  it('preserves loaded data when a later response is malformed', () => {
    const get = jasmine.createSpy('getCarouselPage')
      .and.returnValues(of(response(1, true)), of({ page: 2 }));
    const fixture = setup(get);
    fixture.componentInstance.loadMore();
    fixture.detectChanges();
    expect(fixture.componentInstance.isLoading()).toBeFalse();
    expect(fixture.componentInstance.loadError()).toBeTrue();
    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.albums().map(album => album.guid))
      .toEqual(['album-1']);
  });

  it('clears loading when the stream completes without a response', () => {
    const pending = new Subject<VinylCarouselPageResponse>();
    const get = jasmine.createSpy('getCarouselPage').and.returnValue(pending);
    const fixture = setup(get);
    pending.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.isLoading()).toBeFalse();
  });});