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
          _id: userData._id,
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
    _id: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    });

  save() {

      if (this.userForm.valid) {

        this.isLoading.set(true);

        this.errorMessage.set(null);

        const { _id, name, email } = this.userForm.getRawValue();
        const userData: UserUpdateDto = {
          _id: _id || '',
          name: name || '',
          email: email || ''
        };

        const userId = _id || '';

        this.userService.updateUser(userData).subscribe({
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

              this.alert.showError(messages.join(' | '));
            } else {
              this.errorMessage.set(err.error?.message);
            }
          }
        });
      }
    }

}
