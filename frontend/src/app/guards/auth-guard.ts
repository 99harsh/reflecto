import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthGoogleService } from '../services/auth-google.service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { Loading } from '../services/loading';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGoogleService);
  const router = inject(Router);
  const loadingService = inject(Loading);
  const storage = inject(StorageService);
  const platformId = inject(PLATFORM_ID);

  // ✅ On server → don’t block, let browser handle auth check
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  loadingService.show(); // show spinner (if implemented)

  return authService.checkAuth().pipe(
    map(isAuthenticated => {
      loadingService.hide();

      if (isAuthenticated) {
        return true;
      } else {
        storage.removeItem("user_profile");
        return router.createUrlTree(['/login']);
      }
    }),
    catchError(err => {
      console.error("AuthGuard error:", err);
      loadingService.hide();
      storage.removeItem("user_profile");
      return of(router.createUrlTree(['/login']));
    })
  );
};
