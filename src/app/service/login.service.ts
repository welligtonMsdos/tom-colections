import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { UserLoginDto } from '../domain/user-login-dto';
import { ApiResponse } from '../domain/api-response';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Result } from '../domain/result.model';
import { AlertService } from './alert.service';
interface UserPayload {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

   //private readonly apiUrl = 'http://13.59.37.186:5011/api/Users/';
   private readonly apiUrl = 'http://localhost:5011/api/Users/';

   private userSignal = signal<UserPayload | null>(null);

   currentUser = computed(() => this.userSignal());

    private alert = inject(AlertService);

   constructor(private http: HttpClient
   ) {
    this.getUserFromToken();
   }

   private getUserFromToken() {
    const token = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    this.userSignal.set(null);
  }

  async login(userLoginDto: UserLoginDto): Promise<Result<ApiResponse>> {
  try {
    const response = await firstValueFrom(
      this.http.post<Result<any>>(this.apiUrl + "Login", userLoginDto)
    );

    if (response.success && response.data) {

      const jwt = response.data.result;

      if (jwt) {
        localStorage.setItem('token', jwt);
        this.getUserFromToken();
      }
    }

    return response;

  } catch (error: any) {
    if (error.error) {

      const backendError = error.error;

      this.alert.showError(backendError.Errors ?? 'Erro ao realizar login');

      throw backendError;
    }
    throw error;
  }
}


}
