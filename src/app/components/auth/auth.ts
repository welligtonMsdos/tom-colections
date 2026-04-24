import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthPresentation } from "./auth-presentation/auth-presentation";
import { AuthLogin } from "./auth-login/auth-login";
import { AuthSignup } from "./auth-signup/auth-signup";
@Component({
  selector: 'app-auth',
  imports: [AuthPresentation, AuthLogin, AuthSignup],  
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {  

    isLoginMode = signal(true);

    toggleMode() {
      this.isLoginMode.update(val => !val);
    }
}
