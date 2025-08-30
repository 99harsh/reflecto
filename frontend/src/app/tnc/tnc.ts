import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../shared/header/header';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-tnc',
  imports: [Header],
  templateUrl: './tnc.html',
  styleUrl: './tnc.scss'
})
export class Tnc implements OnInit {
  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.trackLanding("TNC Page View")
  }
}
