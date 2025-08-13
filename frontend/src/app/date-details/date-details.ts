import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-date-details',
  imports: [RouterOutlet],
  templateUrl: './date-details.html',
  styleUrl: './date-details.scss',
  encapsulation: ViewEncapsulation.None
})
export class DateDetails {

}
