import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
       const expectedRoles: string[] = route.data['role'];

    const userRole = this.authService.getRole();

    if (!this.authService.isAuthenticated()) {     
      this.router.navigate(['/auth']);
      return false;
    }

   if (!expectedRoles || expectedRoles.includes(userRole!)) {   
    return true;
  }

     this.router.navigate(['/unauthorized']);
     return false;
  }
}