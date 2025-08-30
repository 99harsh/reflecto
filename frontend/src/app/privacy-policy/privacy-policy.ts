import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../shared/header/header';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [Header],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss'
})
export class PrivacyPolicy implements OnInit {
  private analytics = inject(AnalyticsService);
  ngOnInit(): void {
    this.analytics.trackLanding("Privacy Plolicy Page View")
  }
}
