import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {  map } from 'rxjs';
import { AuthGoogleService } from '../services/auth-google.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGoogleService);
  const router = inject(Router);
  return authService.checkAuth().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        localStorage.removeItem("user_profile");
        router.navigate(['/login']);
        return false;
      }
    })
  );
};