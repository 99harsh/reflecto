import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { Router, RouterLink } from '@angular/router';
import { QuotesCarousel } from '../shared/quotes-carousel/quotes-carousel';
import { Spinner } from '../shared/spinner/spinner';
import { AuthGoogleService } from '../services/auth-google.service';
import { SmartHttpService } from '../services/smart-http.service';

@Component({
  selector: 'app-home',
  imports: [Progressbar, QuotesCarousel, Spinner,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home implements OnInit {

  router = inject(Router);
  private http = inject(SmartHttpService);
  authService = inject(AuthGoogleService);
  dashboardStats = signal<any>({});

  progress = 75; // or dynamically from goal progress
  date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  quote = "Push yourself, because no one else is going to do it for you.";

  // Circle math for stroke
  radius = 35;
  circumference = 2 * Math.PI * this.radius;

  redirectToReflection = () => {
    this.router.navigate(['reflection'])
  }

  redirectToMood = () => {
    this.router.navigate(['mood'])
  }
  ngOnInit(): void {
    this.getDasboardData()
  }

  getDasboardData = () => {
    this.http.get("stats/dashboard").subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.dashboardStats.set(resp.data);
        }
      }
    })
  }
}
