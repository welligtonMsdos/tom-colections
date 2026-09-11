import { Component, signal } from '@angular/core';
import { AuthLogin } from './auth-login/auth-login';
import { AuthSignup } from './auth-signup/auth-signup';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AuthLogin, AuthSignup],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginMode = signal(true);

  toggleMode(): void {
    this.isLoginMode.update((isLoginMode) => !isLoginMode);
  }
}
