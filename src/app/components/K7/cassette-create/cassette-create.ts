import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CassetteCreateDto, CassetteDto } from '../../../domain/cassette.model';
import { AlertService } from '../../../service/alert.service';
import { CassetteService } from '../../../service/cassette.service';

@Component({
  selector: 'app-cassette-create',
  imports: [ReactiveFormsModule],
  templateUrl: './cassette-create.html',
})
export class CassetteCreate {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly cassetteService = inject(CassetteService);
  private readonly alert = inject(AlertService);

  readonly close = output<void>();
  readonly saved = output<CassetteDto>();
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

  save(): void {
    if (this.cassetteForm.invalid) {
      this.cassetteForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const cassette: CassetteCreateDto = this.cassetteForm.getRawValue();

    this.cassetteService.post(cassette).subscribe({
      next: (createdCassette) => {
        this.alert.showSuccess('Fita cadastrada com sucesso!');
        this.saved.emit(createdCassette);
        this.close.emit();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(
          error.error?.message || 'Não foi possível cadastrar a fita.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
