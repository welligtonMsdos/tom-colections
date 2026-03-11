import { ConcertUpdateDto } from './../../../domain/concert.model';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConcertService } from '../../../service/concert.service';
import { AlertService } from '../../../service/alert.service';
import { ConcertDto } from '../../../domain/concert.model';

@Component({
  selector: 'app-concert-update',
  imports: [ReactiveFormsModule],
  templateUrl: './concert-update.html',
  styleUrl: './concert-update.css',
})
export class ConcertUpdate {

  concert = input.required<ConcertDto>();

  constructor() {

    effect(() => {
      const concertData = this.concert();
      if (concertData) {
        this.concertForm.patchValue({
          guid: concertData.guid,
          artist: concertData.artist,
          venue: concertData.venue,
          showDate: concertData.showDate,
          photo: concertData.photo
        });
      }
    });
  }

  private fb = inject(FormBuilder).nonNullable;
  private concertService = inject(ConcertService);
  private alert = inject(AlertService);
  close = output<void>();
  saved = output<ConcertDto>();
  updateErrorMessage = () => {};
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  concertForm = this.fb.group({
    guid: [''],
    artist: ['', [Validators.required, Validators.minLength(3)]],
    venue: ['', [Validators.required, Validators.minLength(3)]],
    showDate: [new Date(), [Validators.required]],
    photo: ['', Validators.required]
  });

  save() {
    if (this.concertForm.valid) {
       this.isLoading.set(true);
       this.errorMessage.set(null);
       const concertData: ConcertUpdateDto = this.concertForm.getRawValue();
       this.concertService.put(concertData).subscribe({
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
