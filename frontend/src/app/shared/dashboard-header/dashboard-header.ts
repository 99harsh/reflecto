import { ChangeDetectorRef, Component, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SmartHttpService } from '../../services/smart-http.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss',
  standalone: true,
  animations: [
    // Content slide in
    trigger('slideUpIn', [
      transition(':enter', [
        style({ transform: 'translateX(10px', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardHeader implements OnInit {
  router = inject(Router);
  _cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  http = inject(SmartHttpService);

  isDropdownOpen = signal<boolean>(false);
  username = signal<string>(""); // Replace with actual username from your user service
  userEmail = signal<string>(""); // Replace with actual email from your user service
  profileData = signal({
    name: "User",
    email: "user@example.com"
  });
  isMobileNavOpen = signal<boolean>(false);

  toggleMobileNav() {
    this.isMobileNavOpen.set(!this.isMobileNavOpen());
  }

  ngOnInit(): void {
    let user_profile: any = this.getItem("user_profile");
    if (user_profile) {
      user_profile = JSON.parse(user_profile);
      console.log(user_profile)
      this.profileData.update((prev: any) => ({
        ...prev,
        name: user_profile?.name || "User",
        email: user_profile?.email || "user@example.com"
      }));
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  navigateToProfile() {
    // Replace with your actual profile route
    this.router.navigate(['/profile']);
  }

  logout() {
    this.http.get("auth/logout").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.router.navigate(["/login"]);
          localStorage.clear();
        }
      }
    })
  }

  // Optional: Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.isDropdownOpen.set(false);
    }
  }

  private getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  get firstChar() {
    return this.profileData().name[0] || "U";
  }


}
