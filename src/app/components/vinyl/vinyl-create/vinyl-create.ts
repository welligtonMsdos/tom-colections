import { Component, inject, output, signal } from '@angular/core';
import { VinylService } from '../../../service/vinyl.service';
import { AlertService } from '../../../service/alert.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VinylCreateDto } from '../../../domain/vinylCreate.model';

@Component({
  selector: 'app-vinyl-create',
  imports: [ReactiveFormsModule],
  templateUrl: './vinyl-create.html',
  styleUrl: './vinyl-create.css',
})
export class VinylCreate {

  private fb = inject(FormBuilder);
  private vinylService = inject(VinylService);
  private alert = inject(AlertService);
  close = output<void>();
  saved = output<any>();

  updateErrorMessage = () => {};

  errorMessage = signal<string | null>(null);

  isLoading = signal(false);

  vinylForm = this.fb.group({
    artist: ['', [Validators.required, Validators.minLength(3)]],
    album: ['', [Validators.required, Validators.minLength(3)]],
    year: [0, [Validators.required]],
    photo: ['', Validators.required],
    price: [0, Validators.required]
  });

  save() {
    if (this.vinylForm.valid) {

      this.isLoading.set(true);

      this.errorMessage.set(null);

      const { artist, album, year, photo, price } = this.vinylForm.getRawValue();
           const vinylData: VinylCreateDto = {
             artist: artist || '',
             album: album || '',
             year: year || 0,
             photo: photo || '',
             price: price || 0
           };

      this.vinylService.post(vinylData).subscribe({
        next: (response) => {
          if (response.success) {
            this.alert.showSuccess(response.message || 'Cadastro realizado com sucesso!');
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
            this.errorMessage.set(err.error?.message || 'Erro desconhecido no servidor.');
          }
        }
      });
    }
  }

}
