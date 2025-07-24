import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, RouterLinkActive, Router],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss'
})
export class DashboardHeader {
isDropdownOpen = false;
  username = 'Harsh Agrawal'; // Replace with actual username from your user service
  userEmail = 'harsh@example.com'; // Replace with actual email from your user service
  router = inject(Router)
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile() {
    // Replace with your actual profile route
    this.isDropdownOpen = false;
    // If using Angular Router:
    // this.router.navigate(['/profile-settings']);
    this.router.navigate(['/profile']);
  }

  logout() {
    this.isDropdownOpen = false;
    // Add your logout logic here
    // For example, clear tokens and redirect:
    // this.authService.logout();
  }

  // Optional: Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.isDropdownOpen = false;
    }
  }
}
