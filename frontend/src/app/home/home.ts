import { Component } from '@angular/core';
import { Progressbar } from '../shared/progressbar/progressbar';
import { Notebook } from '../shared/notebook/notebook';

@Component({
  selector: 'app-home',
  imports: [ Progressbar, Notebook],
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
