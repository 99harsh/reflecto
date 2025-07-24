import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeader } from '../shared/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard-landing',
  imports: [RouterOutlet, DashboardHeader],
  templateUrl: './dashboard-landing.html',
  styleUrl: './dashboard-landing.scss'
})
export class DashboardLanding {

}
