import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  exp?: number;
  // outros claims que seu backend envia
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }

  getRole(): string | null {
    if (!this.token) return null;
    const decoded = jwtDecode<JwtPayload>(this.token);
    return decoded.role || null;
  }

  isAuthenticated(): boolean {
    if (!this.token) return false;
    const decoded = jwtDecode<JwtPayload>(this.token);
    return decoded.exp ? Date.now() < decoded.exp * 1000 : true;
  }

}
