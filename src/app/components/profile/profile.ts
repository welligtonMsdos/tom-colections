import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private fb = inject(FormBuilder);

  public loginService = inject(LoginService);

   constructor() {

    effect(() => {
      const userData = this.loginService.currentUser();
      if (userData) {
        this.userForm.patchValue({
          name: userData.name,
          email: userData.email
        });
      }
    });
  }

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    });

}
