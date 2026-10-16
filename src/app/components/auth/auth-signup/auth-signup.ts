import { Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignUpDto } from '../../../domain/userCreate.model';
import { UserService } from '../../../service/user.service';
import { AlertService } from '../../../service/alert.service';

interface PasswordRequirement {
  label: string;
  isMet: boolean;
}

@Component({
  selector: 'app-auth-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './auth-signup.html',
})
export class AuthSignup {

  authForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-z]/),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/\d/),
      Validators.pattern(/[^A-Za-z0-9]/),
    ]),
  });

  private userService = inject(UserService);
  private alert = inject(AlertService); 

  toggle = output<void>();

  updateErrorMessage = () => {};

  hide = signal(true);

  isLoading = signal(false);

  passwordRequirements = signal<PasswordRequirement[]>(
    this.getPasswordRequirements('')
  );

  isPasswordSecure = computed(() =>
    this.passwordRequirements().every((requirement) => requirement.isMet)
  );

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updatePasswordRequirements(password: string): void {
    this.passwordRequirements.set(
      this.getPasswordRequirements(password)
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

  save(): void {
    if (this.isLoading()) {
      return;
    }

    if (!this.isPasswordSecure()) {
      this.authForm.controls.password.markAsTouched();
      this.alert.showError(
        'A senha deve conter letras minúsculas, maiúsculas, números e um caractere especial.'
      );

      return;
    }

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      this.alert.showError('Preencha corretamente todos os campos para continuar.');

      return;
    }

    const { name, email, password } = this.authForm.getRawValue();
    const userData: UserSignUpDto = {
      name: name || '',
      email: email || '',
      password: password || '',
      role: 1,
    };

    this.isLoading.set(true);

    this.userService
      .signUp(userData)
      .then((data) => {
        if (!data.success) {
          this.alert.showError(
            this.getErrorMessage(data.errors) ??
              data.message ?? 'Não foi possível realizar o cadastro.'
          );

          return;
        }

        this.alert.showSuccess('Cadastro realizado com sucesso.');
        this.toggle.emit();
      })
      .catch((error: unknown) => {
        this.alert.showError(
          this.getErrorMessage(error) ?? 'Não foi possível realizar o cadastro.'
        );
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  private getErrorMessage(error: unknown): string | undefined {
    if (typeof error === 'string') {
      return error.trim() || undefined;
    }

    if (error === null || typeof error !== 'object') {
      return undefined;
    }

    const values: unknown[] = Array.isArray(error)
      ? error
      : Object.values(error);

    for (const value of values) {
      const message = this.getErrorMessage(value);

      if (message) {
        return message;
      }
    }

    return undefined;
  }
}
