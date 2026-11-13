import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdDto, CdUpdateDto } from '../../../domain/cd.model';
import { AlertService } from '../../../service/alert.service';
import { CdService } from '../../../service/cd.service';

@Component({
  selector: 'app-cd-update',
  imports: [ReactiveFormsModule],
  templateUrl: './cd-update.html',
})
export class CdUpdate {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly cdService = inject(CdService);
  private readonly alert = inject(AlertService);

  readonly cd = input.required<CdDto>();
  readonly close = output<void>();
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly cdForm = this.fb.group({
    artist: ['', [Validators.required, Validators.minLength(3)]],
    album: ['', [Validators.required, Validators.minLength(3)]],
    year: [new Date().getFullYear(), [Validators.required]],
    photo: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      this.cdForm.patchValue(this.cd());
    });
  }

  save(): void {
    if (this.cdForm.invalid || this.isLoading()) {
      this.cdForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const cd: CdUpdateDto = this.cdForm.getRawValue();

    this.cdService.put(cd, this.cd().guid).subscribe({
      next: () => {
        this.alert.showSuccess('CD atualizado com sucesso!');
        this.close.emit();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(
          error.error?.message || 'Não foi possível atualizar o CD.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
