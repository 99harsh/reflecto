import { Component, inject, OnInit } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { Router } from '@angular/router';
import { QuotesCarousel } from '../shared/quotes-carousel/quotes-carousel';
import { Spinner } from '../shared/spinner/spinner';
import { AuthGoogleService } from '../services/auth-google.service';
import { SmartHttpService } from '../services/smart-http.service';

@Component({
  selector: 'app-home',
  imports: [Progressbar, QuotesCarousel, Spinner],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  router = inject(Router);
  private http = inject(SmartHttpService);
  authService = inject(AuthGoogleService);

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
   this.http.get("task/get").subscribe({
    next: (resp) => {
    }
   })
  }

}
