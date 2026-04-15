import { Component, signal, output, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { UserCreateDto } from '../../../domain/userCreate.model';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alert = inject(AlertService);
  close = output<void>();
  saved = output<any>();

  updateErrorMessage = () => {};

  errorMessage = signal<string | null>(null);

  isLoading = signal(false);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group) => group.get('password')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true }
  });

  save() {

    if (this.userForm.valid) {

      this.isLoading.set(true);

      this.errorMessage.set(null);

      const { name, email, password } = this.userForm.getRawValue();
      const userData: UserCreateDto = {
        name: name || '',
        email: email || '',
        password: password || ''
      };

      this.userService.post(userData).subscribe({
        next: (response) => {

          if (response.success) {
            this.alert.showSuccess(response.message);
          }

          this.saved.emit(response.data);

          this.close.emit();
        },
        error: (err) => {

          this.isLoading.set(false);

          var msgError = err.error?.errors;

          const eObjetoLiteral = msgError !== null && typeof msgError === 'object' && !Array.isArray(msgError);
          if(eObjetoLiteral){            
            const messages = Object.values(err.error?.errors).flat() as string[];
            this.errorMessage.set(messages.join(' | '));
          }else{            
            this.errorMessage.set(msgError);
          }

        }
      });
    }
  }

}
