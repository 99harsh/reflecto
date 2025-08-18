import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  try {
    const userProfile = getItem("user_profile");

    if (userProfile) {
      // ✅ Already logged in → directly redirect (no flicker)
      return router.parseUrl("/home");
    }

    // ✅ No profile in localStorage → allow access
    return true;

  } catch (err) {
    // ✅ If localStorage fails, allow guest access
    console.error("LocalStorage access error:", err);
    return true;
  }

  function getItem(key: string) {
    if (isPlatformBrowser(platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }
};
