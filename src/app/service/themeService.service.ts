import { effect, Injectable, signal, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private platformId = inject(PLATFORM_ID);

  darkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.darkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

      effect(() => {
        const isDark = this.darkMode();
        const themeValue = isDark ? 'dark' : 'light';

        document.documentElement.setAttribute('data-bs-theme', themeValue);

        localStorage.setItem('theme', themeValue);
      });
    }
  }

  toggleTheme() {
    this.darkMode.update(val => !val);
  }

}
