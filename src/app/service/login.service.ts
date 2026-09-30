import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { UserLoginDto } from '../domain/user-login-dto';
import { ApiResponse } from '../domain/api-response';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Result } from '../domain/result.model';
import { ConcertService } from './concert.service';
import { AuthService } from './auth.service';

interface UserPayload {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

   //private readonly apiUrl = 'https://authproject-8vvl.onrender.com/api/Auth/';   
   private readonly apiUrl = 'http://localhost:5001/api/Auth/';

   private userSignal = signal<UserPayload | null>(null);

   currentUser = computed(() => this.userSignal());

   private concertService = inject(ConcertService);

   private authService = inject(AuthService);

   constructor(private http: HttpClient
   ) {
    this.getUserFromToken();
   }

   private getUserFromToken() {   

    const token = this.authService.getToken();

    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        this.userSignal.set(decoded);
      } catch (error) {
        console.error('Token inválido', error);
        this.logout();
      }
    }
  }

  logout() {    
    this.authService.clearToken();
    this.userSignal.set(null);
    this.concertService.refresh();
  }

  async login(userLoginDto: UserLoginDto): Promise<Result<ApiResponse>> {
  try {
        const response = await firstValueFrom(
        this.http.post<Result<any>>(this.apiUrl + "Login", userLoginDto)
      );          

      if (response.success && response.data) {

        const jwt = response.data.token;    
        
        console.log('response received:', response);
        
        console.log('JWT recebido:', jwt);

        if (jwt) {
          this.authService.setToken(jwt);     
          this.getUserFromToken();     
        }
      }   

      return response;

    } catch (error: any) {         

      const apiError = error.error;      

      const messageToDisplay = apiError?.errors || apiError?.Errors || "Erro ao realizar login.";      
    
      throw messageToDisplay;

    }
  }

}
