import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserPasswordUpdateDto } from '../../domain/user-password-update.model';
import { UserService } from '../../service/user.service';
import { AlertService } from '../../service/alert.service';
import { LoginService } from '../../service/login.service';

interface PasswordRequirement {
  label: string;
  isMet: boolean;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alert = inject(AlertService);

  readonly loginService = inject(LoginService);
  readonly isPasswordFormVisible = signal(false);
  readonly isLoading = signal(false);

  readonly userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/\d/),
        Validators.pattern(/[^A-Za-z0-9]/),
      ],
    ],
    confirmNewPassword: ['', Validators.required],
  });

  private readonly passwordValues = toSignal(
    this.passwordForm.valueChanges,
    { initialValue: this.passwordForm.getRawValue() }
  );

  readonly passwordRequirements = computed(() =>
    this.getPasswordRequirements(this.passwordValues().newPassword ?? '')
  );

  readonly isPasswordSecure = computed(() =>
    this.passwordRequirements().every((requirement) => requirement.isMet)
  );

  readonly passwordsMatch = computed(() => {
    const { newPassword, confirmNewPassword } = this.passwordValues();

    return Boolean(newPassword) && newPassword === confirmNewPassword;
  });

  constructor() {
    effect(() => {
      const userData = this.loginService.currentUser();

      if (!userData) {
        return;
      }

      this.userForm.patchValue({
        name: userData.name,
        email: userData.email,
      });
    });
  }

  togglePasswordForm(): void {
    if (this.isLoading()) {
      return;
    }

    this.isPasswordFormVisible.update((isVisible) => !isVisible);
  }

  submitPasswordChange(): void {
    if (this.isLoading()) {
      return;
    }

    if (
      !this.isPasswordSecure() ||
      !this.passwordsMatch() ||
      this.passwordForm.invalid
    ) {
      this.passwordForm.markAllAsTouched();
      this.alert.showError(
        'Revise os requisitos e a confirmação da nova senha.'
      );

      return;
    }

    const passwordData: UserPasswordUpdateDto = this.passwordForm.getRawValue();

    this.isLoading.set(true);
    this.userService
      .updatePassword(passwordData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.alert.showError(this.getApiErrorMessage(response));

            return;
          }

          this.alert.showSuccess(
            response.message || 'Senha atualizada com sucesso.'
          );
          this.passwordForm.reset();
          this.isPasswordFormVisible.set(false);
        },
        error: (error: unknown) => {
          const apiError: unknown =
            error instanceof HttpErrorResponse ? error.error : error;

          this.alert.showError(this.getApiErrorMessage(apiError));
        },
      });
  }

  private getApiErrorMessage(error: unknown): string {
    const fallback = 'Não foi possível atualizar a senha.';

    if (typeof error === 'string') {
      return error || fallback;
    }

    if (!error || typeof error !== 'object') {
      return fallback;
    }

    const response = error as Record<string, unknown>;
    const errors = response['errors'] ?? response['Errors'];
    const messages: unknown[] = Array.isArray(errors)
      ? errors
      : errors && typeof errors === 'object'
        ? Object.values(errors).flat()
        : [errors];
    const errorMessages = messages.filter(
      (message): message is string =>
        typeof message === 'string' && message.length > 0
    );

    if (errorMessages.length > 0) {
      return errorMessages.join(' | ');
    }

    const message = response['message'] ?? response['Message'];

    return typeof message === 'string' && message ? message : fallback;
  }

  private getPasswordRequirements(password: string): PasswordRequirement[] {
    return [
      {
        label: 'Uma letra minúscula',
        isMet: /[a-z]/.test(password),
      },
      {
        label: 'Uma letra maiúscula',
        isMet: /[A-Z]/.test(password),
      },
      {
        label: 'Um número',
        isMet: /\d/.test(password),
      },
      {
        label: 'Um caractere especial',
        isMet: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }
}
