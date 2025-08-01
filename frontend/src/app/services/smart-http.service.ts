// smart-http.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { env } from '../env';

@Injectable({ providedIn: 'root' })
export class SmartHttpService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<T>(env.BE_URL+url);
    } else {
      // Avoid SSR calling protected cookie APIs
      return of(null as unknown as T);
    }
  }

  post<T>(url: string, body: any): Observable<T> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<T>(env.BE_URL+url, body);
    } else {
      return of(null as unknown as T);
    }
  }
}
