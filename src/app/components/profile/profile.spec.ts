import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPasswordUpdateDto } from '../../domain/user-password-update.model';
import { AlertService } from '../../service/alert.service';
import { LoginService } from '../../service/login.service';
import { Profile } from './profile';

describe('Profile password change', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let http: HttpTestingController;
  let alert: jasmine.SpyObj<AlertService>;

  const endpoint = 'https://theband-auth.onrender.com/api/Users/password';
  const passwordData: UserPasswordUpdateDto = {
    currentPassword: 'Current123!',
    newPassword: 'NewPassword123!',
    confirmNewPassword: 'NewPassword123!',
  };

  beforeEach(async () => {
    alert = jasmine.createSpyObj<AlertService>(
      'AlertService',
      ['showSuccess', 'showError']
    );

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AlertService, useValue: alert },
        {
          provide: LoginService,
          useValue: { currentUser: signal(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    component.isPasswordFormVisible.set(true);
    component.passwordForm.setValue(passwordData);
  });

  afterEach(() => {
    http.verify();
  });

  it('sends the password contract and shows the API success message', () => {
    component.submitPasswordChange();

    const request = http.expectOne(endpoint);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(passwordData);
    expect(component.isLoading()).toBeTrue();

    request.flush({ success: true, message: 'Senha alterada.', data: null });

    expect(alert.showSuccess).toHaveBeenCalledWith('Senha alterada.');
    expect(component.isLoading()).toBeFalse();
    expect(component.isPasswordFormVisible()).toBeFalse();
    expect(component.passwordForm.getRawValue()).toEqual({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  });

  it('keeps the form when the API rejects the change', () => {
    component.submitPasswordChange();
    http.expectOne(endpoint).flush({
      success: false,
      message: 'Senha atual incorreta.',
      data: null,
      errors: null,
    });

    expect(alert.showError).toHaveBeenCalledWith('Senha atual incorreta.');
    expect(component.passwordForm.getRawValue()).toEqual(passwordData);
    expect(component.isPasswordFormVisible()).toBeTrue();
    expect(component.isLoading()).toBeFalse();
  });

  it('shows API validation errors on HTTP failure and allows retry', () => {
    component.submitPasswordChange();
    http.expectOne(endpoint).flush(
      { errors: { currentPassword: ['Senha atual incorreta.'] } },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(alert.showError).toHaveBeenCalledWith('Senha atual incorreta.');
    expect(component.isLoading()).toBeFalse();

    component.submitPasswordChange();
    http.expectOne(endpoint).flush({ success: true, message: 'Senha alterada.' });
  });

  it('rechecks confirmation as the user edits and blocks invalid submissions', () => {
    expect(component.passwordsMatch()).toBeTrue();
    component.passwordForm.controls.confirmNewPassword.setValue('Different123!');
    expect(component.passwordsMatch()).toBeFalse();

    component.submitPasswordChange();
    http.expectNone(endpoint);
    expect(alert.showError).toHaveBeenCalled();

    component.passwordForm.controls.confirmNewPassword.setValue(
      passwordData.newPassword
    );
    expect(component.passwordsMatch()).toBeTrue();

    component.submitPasswordChange();
    http.expectOne(endpoint).flush({ success: true, message: 'Senha alterada.' });
  });

  it('blocks duplicate requests while saving', () => {
    component.submitPasswordChange();
    component.submitPasswordChange();
    component.togglePasswordForm();

    expect(component.isPasswordFormVisible()).toBeTrue();
    http.expectOne(endpoint).flush({ success: true, message: 'Senha alterada.' });
  });
});
