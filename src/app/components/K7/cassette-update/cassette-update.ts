import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CassetteDto, CassetteUpdateDto } from '../../../domain/cassette.model';
import { AlertService } from '../../../service/alert.service';
import { CassetteService } from '../../../service/cassette.service';

@Component({
  selector: 'app-cassette-update',
  imports: [ReactiveFormsModule],
  templateUrl: './cassette-update.html',
})
export class CassetteUpdate {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly cassetteService = inject(CassetteService);
  private readonly alert = inject(AlertService);

  readonly cassette = input.required<CassetteDto>();
  readonly close = output<void>();
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly updateErrorMessage = (): void => {};

  readonly cassetteForm = this.fb.group({
    artist: ['', [Validators.required, Validators.minLength(3)]],
    album: ['', [Validators.required, Validators.minLength(3)]],
    year: [new Date().getFullYear(), [Validators.required]],
    photo: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      this.cassetteForm.patchValue(this.cassette());
    });
  }

  save(): void {
    if (this.cassetteForm.invalid) {
      this.cassetteForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const cassette: CassetteUpdateDto = this.cassetteForm.getRawValue();

    this.cassetteService.put(cassette, this.cassette().guid).subscribe({
      next: () => {
        this.alert.showSuccess('Fita atualizada com sucesso!');
        this.close.emit();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(
          error.error?.message || 'Não foi possível atualizar a fita.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
