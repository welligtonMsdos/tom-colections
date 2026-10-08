import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VinylCarouselAlbum } from '../../../domain/vinyl-carousel.model';
import { VinylCarouselComponent } from './vinyl-carousel';

describe('VinylCarouselComponent', () => {
  let fixture: ComponentFixture<VinylCarouselComponent>;
  let component: VinylCarouselComponent;
  const photo = 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>');
  const albums: readonly VinylCarouselAlbum[] = [
    { guid: 'first', foto: photo },
    { guid: 'second', photo },
    { guid: 'third', foto: photo },
  ];

  const setAlbums = (items: readonly VinylCarouselAlbum[]): void => {
    fixture.componentRef.setInput('albums', items);
    fixture.detectChanges();
  };

  const albumButtons = (): NodeListOf<HTMLButtonElement> =>
    (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.vinyl-carousel__album'
    );

  const stage = (): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector(
      '.vinyl-carousel__stage'
    )!;

  const pointer = (
    type: string,
    x: number,
    y: number,
    pointerType: string = 'mouse'
  ): PointerEvent => new PointerEvent(type, {
    bubbles: true,
    pointerId: 1,
    pointerType,
    isPrimary: true,
    button: 0,
    clientX: x,
    clientY: y,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinylCarouselComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(VinylCarouselComponent);
    component = fixture.componentInstance;
  });

  it('selects the first album and accepts both photo field names', () => {
    const selection = jasmine.createSpy('selection');
    component.selectionChange.subscribe(selection);
    setAlbums(albums);
    expect(component.activeIndex).toBe(0);
    expect(selection).toHaveBeenCalledOnceWith('first');
    expect(component.photoUrl(albums[1])).toBe(photo);
    expect(albumButtons()[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('selects a neighbor without emitting albumClick', () => {
    const clicked = jasmine.createSpy('clicked');
    const selection = jasmine.createSpy('selection');
    component.albumClick.subscribe(clicked);
    component.selectionChange.subscribe(selection);
    setAlbums(albums);
    selection.calls.reset();
    albumButtons()[1].click();
    fixture.detectChanges();
    expect(component.activeIndex).toBe(1);
    expect(selection).toHaveBeenCalledOnceWith('second');
    expect(clicked).not.toHaveBeenCalled();
  });

  it('emits only albumClick when the active album is clicked', () => {
    const clicked = jasmine.createSpy('clicked');
    const selection = jasmine.createSpy('selection');
    component.albumClick.subscribe(clicked);
    component.selectionChange.subscribe(selection);
    setAlbums(albums);
    selection.calls.reset();
    albumButtons()[0].click();
    expect(clicked).toHaveBeenCalledOnceWith('first');
    expect(selection).not.toHaveBeenCalled();
  });

  it('preserves selection by GUID when the input is reordered', () => {
    setAlbums(albums);
    component.select(1);
    const selection = jasmine.createSpy('selection');
    component.selectionChange.subscribe(selection);
    setAlbums([albums[1], albums[0], albums[2]]);
    expect(component.activeIndex).toBe(0);
    expect(selection).not.toHaveBeenCalled();
  });

  it('selects the first remaining album when selection is removed', () => {
    setAlbums(albums);
    component.select(1);
    const selection = jasmine.createSpy('selection');
    component.selectionChange.subscribe(selection);
    setAlbums([albums[2], albums[0]]);
    expect(component.activeIndex).toBe(0);
    expect(selection).toHaveBeenCalledOnceWith('third');
  });

  it('handles empty data and subsequent repopulation', () => {
    setAlbums(albums);
    setAlbums([]);
    expect(albumButtons().length).toBe(0);
    expect((fixture.nativeElement as HTMLElement).textContent)
      .toContain('Nenhum álbum disponível.');
    const selection = jasmine.createSpy('selection');
    component.selectionChange.subscribe(selection);
    setAlbums(albums);
    expect(selection).toHaveBeenCalledOnceWith('first');
  });

  it('disables navigation for a single album', () => {
    setAlbums([albums[0]]);
    const controls = (fixture.nativeElement as HTMLElement)
      .querySelectorAll<HTMLButtonElement>('.btn');
    expect(Array.from(controls).every(button => button.disabled)).toBeTrue();
    component.select(-1);
    component.select(1);
    expect(component.activeIndex).toBe(0);
  });

  it('replaces failed images and retries when their URL changes', () => {
    setAlbums(albums);
    albumButtons()[0].querySelector('img')!
      .dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(component.hasPhoto(albums[0])).toBeFalse();
    expect(albumButtons()[0].textContent).toContain('Capa indisponível');
    const changed = { guid: 'first', foto: photo + '#updated' };
    setAlbums([changed, albums[1]]);
    expect(component.hasPhoto(changed)).toBeTrue();
  });

  it('navigates with keyboard arrows and keeps focus on the selected album', () => {
    setAlbums(albums);
    albumButtons()[0].dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    }));
    fixture.detectChanges();
    expect(component.activeIndex).toBe(1);
    expect(document.activeElement).toBe(albumButtons()[1]);
  });

  it('selects after a horizontal drag and suppresses the resulting click', () => {
    setAlbums(albums);
    const element = stage();
    spyOn(element, 'setPointerCapture');
    spyOn(element, 'hasPointerCapture').and.returnValue(false);
    element.dispatchEvent(pointer('pointerdown', 150, 50));
    element.dispatchEvent(pointer('pointermove', 70, 55));
    expect(component.dragOffset).toBe(-80);
    element.dispatchEvent(pointer('pointerup', 70, 55));
    expect(component.activeIndex).toBe(1);
    expect(component.dragOffset).toBe(0);
    const clicked = jasmine.createSpy('clicked');
    component.albumClick.subscribe(clicked);
    albumButtons()[1].dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      detail: 1,
    }));
    expect(clicked).not.toHaveBeenCalled();
  });

  it('leaves vertical gestures to the browser', () => {
    setAlbums(albums);
    const element = stage();
    const capture = spyOn(element, 'setPointerCapture');
    element.dispatchEvent(pointer('pointerdown', 150, 50));
    element.dispatchEvent(pointer('pointermove', 145, 120));
    element.dispatchEvent(pointer('pointerup', 70, 130));
    expect(component.activeIndex).toBe(0);
    expect(component.dragOffset).toBe(0);
    expect(capture).not.toHaveBeenCalled();
  });

  it('cancels a horizontal gesture without changing selection', () => {
    setAlbums(albums);
    const element = stage();
    spyOn(element, 'setPointerCapture');
    element.dispatchEvent(pointer('pointerdown', 150, 50));
    element.dispatchEvent(pointer('pointermove', 70, 50));
    element.dispatchEvent(pointer('pointercancel', 70, 50));
    expect(component.activeIndex).toBe(0);
    expect(component.dragOffset).toBe(0);
  });

  it('centers the active cover and leaves room for the disc on narrow and wide screens', () => {
    setAlbums(albums);
    const host = fixture.nativeElement as HTMLElement;
    for (const width of [320, 768, 1280]) {
      host.style.width = width + 'px';
      const viewport = stage().getBoundingClientRect();
      const cover = albumButtons()[0].getBoundingClientRect();
      const disc = albumButtons()[0]
        .querySelector<HTMLElement>('.vinyl-carousel__disc')!
        .getBoundingClientRect();
      const label = albumButtons()[0]
        .querySelector<HTMLElement>('.vinyl-carousel__label')!
        .getBoundingClientRect();
      const neighbor = albumButtons()[1].getBoundingClientRect();
      expect(Math.abs(
        (cover.left + cover.width / 2)
          - (viewport.left + viewport.width / 2)
      )).toBeLessThan(1);
      expect(disc.right).toBeLessThanOrEqual(viewport.right);
      expect(disc.left).toBeGreaterThanOrEqual(viewport.left);
      expect(Math.abs((disc.left - cover.left) / cover.width - 0.5))
        .toBeLessThan(0.01);
      expect(Math.abs(label.left + label.width / 2 - cover.right))
        .toBeLessThan(1);
      expect(label.right).toBeLessThanOrEqual(viewport.right);
      expect(neighbor.left).toBeLessThan(viewport.right);
    }
  });

  it('supports a short finger swipe starting on a cover in both directions', () => {
    setAlbums(albums);
    (fixture.nativeElement as HTMLElement).style.width = '320px';
    const element = stage();
    spyOn(element, 'setPointerCapture');
    spyOn(element, 'hasPointerCapture').and.returnValue(false);
    const cover = albumButtons()[0];
    cover.dispatchEvent(pointer('pointerdown', 150, 50, 'touch'));
    cover.dispatchEvent(pointer('pointermove', 122, 52, 'touch'));
    cover.dispatchEvent(pointer('lostpointercapture', 122, 52, 'touch'));
    expect(component.dragOffset).toBe(-28);
    element.dispatchEvent(pointer('pointerup', 122, 52, 'touch'));
    fixture.detectChanges();
    expect(component.activeIndex).toBe(1);

    const nextCover = albumButtons()[1];
    nextCover.dispatchEvent(pointer('pointerdown', 122, 50, 'touch'));
    nextCover.dispatchEvent(pointer('pointermove', 150, 52, 'touch'));
    nextCover.dispatchEvent(pointer('lostpointercapture', 150, 52, 'touch'));
    element.dispatchEvent(pointer('pointerup', 150, 52, 'touch'));
    fixture.detectChanges();
    expect(component.activeIndex).toBe(0);
  });

  it('cancels when the stage itself loses pointer capture', () => {
    setAlbums(albums);
    const element = stage();
    spyOn(element, 'setPointerCapture');
    element.dispatchEvent(pointer('pointerdown', 150, 50, 'touch'));
    element.dispatchEvent(pointer('pointermove', 70, 50, 'touch'));
    element.dispatchEvent(pointer('lostpointercapture', 70, 50, 'touch'));
    expect(component.dragOffset).toBe(0);
    element.dispatchEvent(pointer('pointerup', 70, 50, 'touch'));
    expect(component.activeIndex).toBe(0);
  });
});
