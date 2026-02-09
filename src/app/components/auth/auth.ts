import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlertService } from '../../service/alert.service';
@Component({
  selector: 'app-auth',
  imports: [FormsModule,
            ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage = signal('');

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
        .catch(err => this.errorMessage.set('An error occurred during login. Please try again later.'));
    }

  }

}
