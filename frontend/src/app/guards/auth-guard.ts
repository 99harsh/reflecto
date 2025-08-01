import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, take } from 'rxjs';
import { AuthGoogleService } from '../services/auth-google.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGoogleService);
  const router = inject(Router);
  return authService.checkAuth().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};