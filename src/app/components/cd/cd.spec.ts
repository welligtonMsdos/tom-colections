import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CdDto } from '../../domain/cd.model';
import { AlertService } from '../../service/alert.service';
import { Cd } from './cd';
import { CdCreate } from './cd-create/cd-create';
import { CdUpdate } from './cd-update/cd-update';
import { CdService } from '../../service/cd.service';

const apiUrl: string = 'https://theband-qv3s.onrender.com/api/CDs';
const album: CdDto = {
  guid: 'cd-1',
  artist: 'Artista',
  album: 'Álbum',
  year: 2026,
  photo: 'https://example.com/cover.jpg',
  price: 50,
};

describe('Coleção de CDs', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Cd, CdCreate, CdUpdate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AlertService,
          useValue: {
            showSuccess: jasmine.createSpy('showSuccess'),
            showError: jasmine.createSpy('showError'),
          },
        },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('exibe erro de carregamento e permite tentar novamente', () => {
    const fixture = TestBed.createComponent(Cd);
    fixture.detectChanges();
    http.expectOne(apiUrl).flush('Falha', {
      status: 500,
      statusText: 'Server Error',
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Não foi possível carregar os CDs.');
    const retry = element.querySelector<HTMLButtonElement>('.alert button');
    retry!.click();
    http.expectOne(apiUrl).flush([album]);
    fixture.detectChanges();
    expect(element.textContent).toContain('Álbum');
    expect(element.querySelector('.cd-card__case img')).not.toBeNull();
  });

  it('cadastra e edita um CD, atualizando o resumo sem recarregar a lista', () => {
    const create = TestBed.createComponent(CdCreate);
    const service = TestBed.inject(CdService);
    const { guid, ...data } = album;
    create.componentInstance.cdForm.setValue(data);
    create.componentInstance.save();
    const post = http.expectOne(apiUrl);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual(data);
    post.flush(album);
    expect(service.totalQuantity()).toBe(1);
    expect(service.totalValue()).toBe(50);

    const update = TestBed.createComponent(CdUpdate);
    update.componentRef.setInput('cd', album);
    update.detectChanges();
    update.componentInstance.cdForm.controls.price.setValue(75);
    update.componentInstance.save();
    const put = http.expectOne(`${apiUrl}/${guid}`);
    expect(put.request.method).toBe('PUT');
    put.flush({ ...album, price: 75 });
    expect(service.totalQuantity()).toBe(1);
    expect(service.totalValue()).toBe(75);
  });

  it('mantém os dados após falha de exclusão e atualiza os totais após sucesso', () => {
    const service = TestBed.inject(CdService);
    service.get().subscribe();
    http.expectOne(apiUrl).flush([album]);
    service.delete(album.guid).subscribe({ error: () => {} });
    http.expectOne(`${apiUrl}/${album.guid}`).flush('Falha', {
      status: 500,
      statusText: 'Server Error',
    });
    expect(service.cds()).toEqual([album]);

    service.delete(album.guid).subscribe();
    const request = http.expectOne(`${apiUrl}/${album.guid}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(service.totalQuantity()).toBe(0);
    expect(service.totalValue()).toBe(0);
  });
});
