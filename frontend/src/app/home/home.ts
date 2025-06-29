import { Component } from '@angular/core';
import { Calendar } from '../shared/calendar/calendar';

@Component({
  selector: 'app-home',
  imports: [Calendar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  progress = 75; // or dynamically from goal progress
  date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  quote = "Push yourself, because no one else is going to do it for you.";

  // Circle math for stroke
  radius = 35;
  circumference = 2 * Math.PI * this.radius;

}
