import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConcertCreateDto, ConcertDto } from '../../../domain/concert.model';
import { ConcertService } from '../../../service/concert.service';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-concert-create',
  imports: [ReactiveFormsModule],
  templateUrl: './concert-create.html',
  styleUrl: './concert-create.css',
})
export class ConcertCreate {

  private fb = inject(FormBuilder);
  private concertService = inject(ConcertService);
  private alert = inject(AlertService);
  close = output<void>();
  saved = output<ConcertDto>();
  updateErrorMessage = () => {};
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  concertForm = this.fb.nonNullable.group({
    artist: ['', [Validators.required, Validators.minLength(3)]],
    venue: ['', [Validators.required, Validators.minLength(3)]],
    showDate: [new Date(), [Validators.required]],
    photo: ['', Validators.required]
  });

  save() {

    if (this.concertForm.valid) {

      this.isLoading.set(true);
      this.errorMessage.set(null);
      const concertData: ConcertCreateDto = this.concertForm.getRawValue();

      this.concertService.post(concertData).subscribe({
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
