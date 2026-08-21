import { Component, inject } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule,MatIconModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  public loginService = inject(LoginService);

}
