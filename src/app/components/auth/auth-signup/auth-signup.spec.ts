import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';
import { AlertService } from '../../../service/alert.service';
import { AuthSignup } from './auth-signup';

describe('AuthSignup', () => {
  let component: AuthSignup;
  let fixture: ComponentFixture<AuthSignup>;
  let http: HttpTestingController;
  let alert: jasmine.SpyObj<AlertService>;

  const endpoint = 'https://theband-auth.onrender.com/api/Users/SignUp';

  beforeEach(async () => {
    alert = jasmine.createSpyObj<AlertService>(
      'AlertService',
      ['showError', 'showSuccess']
    );

    await TestBed.configureTestingModule({
      imports: [AuthSignup],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSignup);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    component.authForm.setValue({
      name: 'Teste',
      email: 'teste@example.com',
      password: 'Senha123!',
    });
    component.updatePasswordRequirements('Senha123!');
  });

  afterEach(() => {
    http.verify();
  });

  it('sends the signup contract and prevents duplicate requests', fakeAsync(() => {
    const toggle = spyOn(component.toggle, 'emit');

    component.save();
    component.save();

    const request = http.expectOne(endpoint);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Teste',
      email: 'teste@example.com',
      password: 'Senha123!',
      role: 1,
    });
    expect(component.isLoading()).toBeTrue();

    request.flush({ success: true });
    flushMicrotasks();

    expect(alert.showSuccess).toHaveBeenCalled();
    expect(toggle).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  }));

  it('shows API validation errors and allows retrying', fakeAsync(() => {
    component.save();
    http.expectOne(endpoint).flush(
      { errors: { Email: ['E-mail já cadastrado.'] } },
      { status: 400, statusText: 'Bad Request' }
    );
    flushMicrotasks();

    expect(alert.showError).toHaveBeenCalledWith('E-mail já cadastrado.');
    expect(component.isLoading()).toBeFalse();

    component.save();
    http.expectOne(endpoint).flush({ success: true });
    flushMicrotasks();
  }));

  it('shows failures returned in a successful HTTP response', fakeAsync(() => {
    const toggle = spyOn(component.toggle, 'emit');

    component.save();
    http.expectOne(endpoint).flush({
      success: false,
      errors: null,
      message: 'Cadastro indisponível.',
    });
    flushMicrotasks();

    expect(alert.showError).toHaveBeenCalledWith('Cadastro indisponível.');
    expect(toggle).not.toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  }));

  it('shows a fallback message when the API returns no error details', fakeAsync(() => {
    component.save();
    http.expectOne(endpoint).flush(
      null,
      { status: 500, statusText: 'Server Error' }
    );
    flushMicrotasks();

    expect(alert.showError).toHaveBeenCalledWith(
      'Não foi possível realizar o cadastro.'
    );
    expect(component.isLoading()).toBeFalse();
  }));

  it('does not submit invalid form values', () => {
    component.authForm.controls.email.setValue('invalido');

    component.save();

    http.expectNone(endpoint);
    expect(alert.showError).toHaveBeenCalled();
  });
});
