import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {  map } from 'rxjs';
import { AuthGoogleService } from '../services/auth-google.service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGoogleService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const storage = inject(StorageService);

  return authService.checkAuth().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        storage.removeItem("user_profile");
        router.navigate(['/login']);
        return false;
      }
    })
  );
};