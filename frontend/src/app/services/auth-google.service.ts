import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../auth-config';
import { HttpClient } from '@angular/common/http';
import { env } from '../env';
import { BehaviorSubject, catchError, map, Observable, of, retry, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SmartHttpService } from './smart-http.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGoogleService {

    private http = inject(HttpClient);
    private smartHTTP = inject(SmartHttpService);
    private oAuthService = inject(OAuthService);
    profile = signal<any>(null); 
    private authState = new BehaviorSubject<any | null>(null);
    private userSubject = new BehaviorSubject<any | null>(null);
    user$ = this.userSubject.asObservable();  
    private platformId = signal(PLATFORM_ID);
    private storage = inject(StorageService);

    constructor() {
        if (typeof window !== "undefined") {
            this.initConfiguration();
        }
    }

    get user() {
        return this.userSubject.value;
    }

    checkAuth(): Observable<boolean> {
        if (this.user) {
            return of(true);
        }

        return this.smartHTTP.get<any>(`auth/profile`).pipe(
            tap(user => {
            
            if (user?.status === 401) {
                this.userSubject.next(null);
            } else {
                this.storage.setItem("user_profile", JSON.stringify(user.data));
                this.userSubject.next(user);
            }
            }),
            map(user => user?.status !== 401),
            catchError(() => {
            this.userSubject.next(null);
            return of(false);
            })
        );
    }
    /** Call during login */
    setUser(user: any): void {
        this.authState.next(user);
    }

    fetchUser() {

    }

    private initConfiguration() {
        this.oAuthService.configure(authConfig);
        this.oAuthService.setupAutomaticSilentRefresh();
        this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            if (this.oAuthService.hasValidIdToken()) {
                this.profile.set(this.oAuthService.getIdentityClaims());
            }
        });
    }

    login() {
        this.oAuthService.initImplicitFlow();
    }

    logout() {
        this.oAuthService.revokeTokenAndLogout();
        this.oAuthService.logOut();
        this.profile.set(null);
    }

    getProfile() {
        return this.profile();
    }

    authenticate = (token: string) => {
        return this.http.post(`${env.BE_URL}auth/authenticate`, { token });
    }

    private setItem(key: string, value:any) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.setItem(key, JSON.stringify(value));
    }
    return null;
  }
}