import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { RouterLink } from '@angular/router';
import { QuotesCarousel } from '../shared/quotes-carousel/quotes-carousel';
import { SmartHttpService } from '../services/smart-http.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { Skeleton } from '../shared/skeleton/skeleton';

interface HomeLoading{ isDashboardCards: boolean, isLevelXPStats: boolean }

@Component({
  selector: 'app-home',
  imports: [CommonModule, Progressbar, QuotesCarousel, RouterLink, Skeleton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    // Content slide in
    trigger('slideLeftIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 })) // Exit off-screen to the left
      ])
    ]),
    trigger('slideUpIn', [
      transition(':enter', [
        style({ transform: 'translateX(10px', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class Home implements OnInit {

  private http = inject(SmartHttpService);
  private platformId = inject(PLATFORM_ID)

  dashboardStats = signal<any>({});
  profileProgress = signal<any>({});
  loading = signal<boolean>(true);
  isLoading = signal<HomeLoading>({
    isDashboardCards: false,
    isLevelXPStats: false
  })


  ngOnInit(): void {
    this.getDasboardData();
    this.getProfileProgress();
  }

  getDasboardData = () => {
    this.http.get("stats/dashboard").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.dashboardStats.set(resp.data);
          this.isLoading.update((prev:HomeLoading) =>( {...prev, isDashboardCards: true}))
        }
      }
    })
  };

  getProfileProgress = () => {
    this.http.get("stats/progress").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.profileProgress.set(resp.data);
           this.isLoading.update((prev:HomeLoading) =>( {...prev, isLevelXPStats: true}))
        }
      }
    })
  }

  private getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
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


}
