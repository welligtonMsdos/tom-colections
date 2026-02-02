import { VinylService } from './../../../service/vinyl.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-list-vinil',
  imports: [CurrencyPipe],
  templateUrl: './list-vinil.html',
  styleUrl: './list-vinil.css',
})
export class ListVinil implements OnInit{

 isLoading = signal(true);

 protected vinylService = inject(VinylService);

 ngOnInit(): void {
    this.vinylService.getAllVinyls().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

}
