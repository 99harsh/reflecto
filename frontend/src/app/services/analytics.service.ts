// analytics.service.ts
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { SmartHttpService } from "./smart-http.service";

@Injectable({ providedIn: "root" })
export class AnalyticsService {
  private isBrowser: boolean;

  constructor(
    private http: SmartHttpService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  track(event: string, properties?: any) {
    if (!this.isBrowser) return;

    this.http.post("analytics/track", {
      event,
      properties
    }).subscribe({
      error: (err) => console.error("Analytics track failed", err),
    });
  }

  trackLanding(event:string, properties?: any) {
    if(!this.isBrowser) return;

    this.http.post("analytics/track-landing", {
        event,
        properties
    }).subscribe({
        error: (err) => console.error("Analytics track failed", err) 
    })
  }
}
