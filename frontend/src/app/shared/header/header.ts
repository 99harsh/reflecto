import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  isHome = input<boolean>(true);
  private analytics = inject(AnalyticsService);
  
  scrollToSection(sectionId: string, event: Event) {
    this.analytics.trackLanding("Landing Header Click", {nav: sectionId});
    event.preventDefault(); // prevent default anchor behavior
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
