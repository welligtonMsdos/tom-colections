import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCreateDto } from '../../../domain/userCreate.model';
import { UserService } from '../../../service/user.service';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-auth-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './auth-signup.html',
  styleUrl: './auth-signup.css',
})
export class AuthSignup {

  authForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private userService = inject(UserService);
  private alert = inject(AlertService); 

  toggle = output<void>();

  updateErrorMessage = () => {};

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  save(){

    if (this.authForm.valid) {
    
      const { name, email, password } = this.authForm.getRawValue();
      const userData: UserCreateDto = {
        name: name || '',
        email: email || '',
        password: password || ''
      };
    
      this.userService.signUp(userData)
          .then(data =>{
            if (data.success) {
              this.alert.showSuccess('Sign up successful');
              this.toggle.emit();
            }
          })
          .catch(
            error => {                

              const eObjetoLiteral = error !== null && typeof error === 'object' && !Array.isArray(error);

              if (eObjetoLiteral) {
                var msg = Object.values(error).flat() as string[];
                this.alert.showError(msg[0]);                
              }else{
                this.alert.showError(error);
              }
           }
          )        
    }
  }
  
}
