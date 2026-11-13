import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdCreateDto, CdDto } from '../../../domain/cd.model';
import { AlertService } from '../../../service/alert.service';
import { CdService } from '../../../service/cd.service';

@Component({
  selector: 'app-cd-create',
  imports: [ReactiveFormsModule],
  templateUrl: './cd-create.html',
})
export class CdCreate {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly cdService = inject(CdService);
  private readonly alert = inject(AlertService);

  readonly close = output<void>();
  readonly saved = output<CdDto>();
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly cdForm = this.fb.group({
    artist: ['', [Validators.required, Validators.minLength(3)]],
    album: ['', [Validators.required, Validators.minLength(3)]],
    year: [new Date().getFullYear(), [Validators.required]],
    photo: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  save(): void {
    if (this.cdForm.invalid || this.isLoading()) {
      this.cdForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const cd: CdCreateDto = this.cdForm.getRawValue();

    this.cdService.post(cd).subscribe({
      next: (createdCd) => {
        this.alert.showSuccess('CD cadastrado com sucesso!');
        this.saved.emit(createdCd);
        this.close.emit();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(
          error.error?.message || 'Não foi possível cadastrar o CD.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
