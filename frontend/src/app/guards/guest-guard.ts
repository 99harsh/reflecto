import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR-safe check
  if (!isPlatformBrowser(platformId)) {
    // On server, don’t try to read localStorage → allow guest access
    return true;
  }

  try {
    const userProfile = localStorage.getItem("user_profile");

    if (userProfile) {
      // ✅ Already logged in → redirect to home
      return router.parseUrl("/home");
    }

    // ✅ No profile → allow guest
    return true;
  } catch (err) {
    console.error("LocalStorage access error:", err);
    return true;
  }
};
