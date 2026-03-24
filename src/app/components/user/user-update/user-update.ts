import { Component, signal, output, inject, input, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { AlertService } from '../../../service/alert.service';
import { UserUpdateDto } from '../../../domain/userUpdate.mode';
import { UserDto } from '../../../domain/user.model';

@Component({
  selector: 'app-user-update',
  imports: [ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.css',
})
export class UserUpdate {

  user = input.required<UserDto>();

  constructor() {

    effect(() => {
      const userData = this.user();
      if (userData) {
        this.userForm.patchValue({
          name: userData.name,
          email: userData.email
        });
      }
    });
  }

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
    });

  save() {

      if (this.userForm.valid) {

        this.isLoading.set(true);

        this.errorMessage.set(null);

        const { name, email } = this.userForm.getRawValue();
        const userData: UserUpdateDto = {
          name: name || '',
          email: email || ''
        };

        this.userService.put(userData, this.user()._id).subscribe({
          next: (response) => {

            if (response.success) {
              this.alert.showSuccess(response.message);
            }

            this.saved.emit(response.data);

            this.close.emit();
          },
          error: (err) => {
            this.isLoading.set(false);

            const apiErrors = err.error?.errors;

            if (apiErrors) {

              const messages = Object.values(apiErrors).flat() as string[];

              this.errorMessage.set(messages.join(' | '));

            } else {
              this.errorMessage.set(err.error?.message);
            }
          }
        });
      }
    }

}
