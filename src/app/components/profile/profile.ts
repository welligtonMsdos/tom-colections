import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private readonly alert = inject(AlertService);

  readonly loginService = inject(LoginService);
  readonly isPasswordFormVisible = signal(false);

  readonly userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.group({
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
    confirmPassword: ['', Validators.required],
  });

  readonly passwordRequirements = signal<PasswordRequirement[]>(
    this.getPasswordRequirements('')
  );

  readonly isPasswordSecure = computed(() =>
    this.passwordRequirements().every((requirement) => requirement.isMet)
  );

  readonly passwordsMatch = computed(() => {
    const newPassword = this.passwordForm.controls.newPassword.value;
    const confirmPassword = this.passwordForm.controls.confirmPassword.value;

    return Boolean(newPassword) && newPassword === confirmPassword;
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
    this.isPasswordFormVisible.update((isVisible) => !isVisible);
  }

  updatePasswordRequirements(password: string): void {
    this.passwordRequirements.set(
      this.getPasswordRequirements(password)
    );
  }

  submitPasswordChange(): void {
    if (!this.isPasswordSecure() || !this.passwordsMatch() || this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.alert.showError('Revise os requisitos e a confirmação da nova senha.');

      return;
    }

    this.passwordForm.reset();
    this.passwordRequirements.set(
      this.getPasswordRequirements('')
    );
    this.isPasswordFormVisible.set(false);

    this.alert.showSuccess(
      'Nova senha validada. A alteração será integrada à API posteriormente.'
    );
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
