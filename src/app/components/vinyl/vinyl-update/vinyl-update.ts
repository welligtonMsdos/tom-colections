import { AlertService } from './../../../service/alert.service';
import { VinylService } from './../../../service/vinyl.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { VinylDto } from './../../../domain/vinyl.model';
import { Component, input, effect, inject, output, signal } from '@angular/core';
import { VinylUpdateDto } from '../../../domain/vinyl.model';

@Component({
  selector: 'app-vinyl-update',
  imports: [ReactiveFormsModule],
  templateUrl: './vinyl-update.html',
  styleUrl: './vinyl-update.css',
})
export class VinylUpdate {

  vinyl = input.required<VinylDto>();

  constructor() {

    effect(() => {
      const vinylData = this.vinyl();
      if (vinylData) {
        this.vinylForm.patchValue({
          guid: vinylData.guid,
          artist: vinylData.artist,
          album: vinylData.album,
          year: vinylData.year,
          photo: vinylData.photo,
          price: vinylData.price
        });
      }
    });
  }

  private fb = inject(FormBuilder).nonNullable;
  private vinylService = inject(VinylService);
  private alert = inject(AlertService);
  close = output<void>();
  saved = output<any>();

  updateErrorMessage = () => {};

  errorMessage = signal<string | null>(null);

  isLoading = signal(false);

  vinylForm = this.fb.group({
    guid: [''],
    artist: ['', [Validators.required]],
    album: ['', [Validators.required]],
    year: [new Date().getFullYear(), [Validators.required]],
    photo: [''],
    price: [0, [Validators.min(0)]]
  });

  save() {
    if (this.vinylForm.valid) {

      this.isLoading.set(true);

      this.errorMessage.set(null);

      const vinylData: VinylUpdateDto = this.vinylForm.getRawValue();

      this.vinylService.put(vinylData).subscribe({
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
