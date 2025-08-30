import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SmartHttpService } from '../services/smart-http.service';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Skeleton } from '../shared/skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';
import { Popup } from '../shared/popup/popup';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../shared/spinner/spinner';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, Skeleton, Popup, FormsModule, Spinner],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  animations: [
    trigger('slideUpIn', [
      transition(':enter', [
        style({ transform: 'translateX(10px', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class Profile implements OnInit, OnDestroy {

  profileDetails = signal<any>({});
  loading = signal<boolean>(true);
  isDeletePopup = signal<boolean>(false);
  isResetBtnDisabled = signal<boolean>(true);
  isDataResetting = signal<boolean>(false);
  isDataReset = signal<boolean>(false);
  resetInputText = signal<string>("");

  private http = inject(SmartHttpService);
  private toastr = inject(ToastrService);
  private analytics = inject(AnalyticsService);
  private refreshTimeout: any;

  ngOnInit(): void {
    this.analytics.track("Profile Page View");
    this.loadProfileDetails();
  }

  private loadProfileDetails = () => {
    this.http.get("profile/details").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.profileDetails.set(resp.data);
          this.loading.set(false);
        }
      }
    })
  }

  toggleDeletePopup = () => {
    this.isDeletePopup.set(!this.isDeletePopup());
  }

  resetInputTextChange = (value: any) => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "delete my profile data") {
      this.isResetBtnDisabled.set(false);
    } else {
      this.isResetBtnDisabled.set(true);
    }
  }

  resetAccountData = () => {
    if (!this.isResetBtnDisabled()) {
      this.isDataResetting.set(true);
      this.http.get("profile/reset").subscribe({
        next: (resp: any) => {
          if (resp && resp.status === 200) {
            this.isDataResetting.set(false);
            this.toggleDeletePopup()
            this.toastr.success('Your profile data has been successfully reset. The page will automatically refresh in 3 seconds.');
            this.refreshTimeout = setTimeout(() => {
              window.location.reload();
            }, 3000)
          }
        }
      })
    }
  }

  get memberSince() {
    return this.profileDetails()?.currentUser?.created_at ?
      format(this.profileDetails()?.currentUser?.created_at, "MMM yyyy") : "";
  }

  get nextLevelXP() {
    return 50 * ((this.profileDetails()?.currentUser?.currentLevel + 1) * (this.profileDetails()?.currentUser?.currentLevel + 1));
  }

  ngOnDestroy(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
    }
  }

}