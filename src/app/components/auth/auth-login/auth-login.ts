import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../service/alert.service';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  imports: [FormsModule, ReactiveFormsModule],
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

  toggle = output<void>();

  onToggle() {
    this.toggle.emit();
  }

  private alert = inject(AlertService);


  constructor(private loginService: LoginService,
              private router: Router
  ) {}

  updateErrorMessage = () => {};

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

            this.alert.showSuccess('Welcome ' + this.loginService.currentUser()?.name);

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
