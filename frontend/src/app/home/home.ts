import { Component, inject } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { Router } from '@angular/router';
import { QuotesCarousel } from '../shared/quotes-carousel/quotes-carousel';
import { Spinner } from '../shared/spinner/spinner';

@Component({
  selector: 'app-home',
  imports: [ Progressbar, QuotesCarousel, Spinner],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  router = inject(Router);
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

}
