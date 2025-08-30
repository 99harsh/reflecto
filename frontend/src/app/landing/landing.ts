import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.trackLanding("Landing Page View");
  }
}
