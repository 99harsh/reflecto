import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { Router, RouterLink } from '@angular/router';
import { QuotesCarousel } from '../shared/quotes-carousel/quotes-carousel';
import { Spinner } from '../shared/spinner/spinner';
import { AuthGoogleService } from '../services/auth-google.service';
import { SmartHttpService } from '../services/smart-http.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Progressbar, QuotesCarousel, Spinner, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home implements OnInit {

  router = inject(Router);
  private http = inject(SmartHttpService);
  authService = inject(AuthGoogleService);
  dashboardStats = signal<any>({});
  profileProgress = signal<any>({});

  date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  quote = "Push yourself, because no one else is going to do it for you.";

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  redirectToReflection = () => {
    this.router.navigate(['reflection'])
  }

  redirectToMood = () => {
    this.router.navigate(['mood'])
  }
  ngOnInit(): void {
    this.getDasboardData();
    this.getProfileProgress();
  }

  getDasboardData = () => {
    this.http.get("stats/dashboard").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.dashboardStats.set(resp.data);
        }
      }
    })
  };

  getProfileProgress = () => {
    this.http.get("stats/progress").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.profileProgress.set(resp.data);
          const data = resp.data
          const currentXP = data.xp;
          
        }
      }
    })
  }

  get getGreetingTime() {
    const now = new Date();
    const hours = now.getHours(); // 0–23

    if (hours >= 5 && hours < 12) {
      return "🌅 Good Morning";
    } else if (hours >= 12 && hours < 18) {
      return "🌇 Good Afternoon";
    } else {
      return "🌆 Good Evening";
    }
  }

  get userName() {
    let userDetails: any = this.getItem("user_profile");
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      return userDetails.name;
    }
    return "User"
  }

  private getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }
}
