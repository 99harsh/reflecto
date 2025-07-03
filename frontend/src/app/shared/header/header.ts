import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isDropdownOpen = false;
  username = 'John Doe';
  userEmail = 'john.doe@example.com';

  elementRef = inject(ElementRef);
  router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const profileWrapper = this.elementRef.nativeElement.querySelector('.profile-wrapper');
    const dropdownWrapper = this.elementRef.nativeElement.querySelector('.rfto-dropdown-menu')
    console.log(profileWrapper, target, profileWrapper.contains(target))
    // Check if the click is outside the profile wrapper
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
