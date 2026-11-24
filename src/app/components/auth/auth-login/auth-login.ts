import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../service/alert.service';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { AuthSignup } from '../auth-signup/auth-signup';
import { CollectionGallery } from '../collection-gallery/collection-gallery';

@Component({
  selector: 'app-auth-login',
  imports: [FormsModule, ReactiveFormsModule, AuthSignup, CollectionGallery],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css',
})
export class AuthLogin {

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage = signal('');

  readonly isLoginMode = signal(true);

  private alert = inject(AlertService);


  constructor(private loginService: LoginService,
              private router: Router
  ) {}

  updateErrorMessage = () => {};

  onToggle(): void {
    this.isLoginMode.update((isLoginMode) => !isLoginMode);
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login(){

    const email = this.authForm.get('email')?.value;

    const password = this.authForm.get('password')?.value;

    if (email && password) {

        this.loginService.login({ email, password })
        .then(data =>{
          if (data.success) {          

            this.alert.showSuccess('Olá ' + this.loginService.currentUser()?.name);

            this.router.navigate(['/home']);
          }
        })
        .catch(
          error => {            
            this.alert.showError(error.error || error);
          } );
    }
    
  }

}
