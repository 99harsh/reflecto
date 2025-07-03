import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isDropdownOpen = false;
  username = 'John Doe';
  userEmail = 'john.doe@example.com';

  elementRef = inject(ElementRef);
  router = inject(Router);
  currentRoute = "";

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const profileWrapper = this.elementRef.nativeElement.querySelector('.profile-wrapper');
    const dropdownWrapper = this.elementRef.nativeElement.querySelector('.rfto-dropdown-menu')

    if (profileWrapper && !profileWrapper.contains(target) && !dropdownWrapper.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile() {
    this.isDropdownOpen = false;
    this.router.navigate(["/profile"])
  }

  logout() {
    this.isDropdownOpen = false;
  }
}
