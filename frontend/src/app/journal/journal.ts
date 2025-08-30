import { Component, inject, OnInit, signal } from '@angular/core';
import { Notebook } from '../shared/notebook/notebook';
import { format } from 'date-fns';
import { SmartHttpService } from '../services/smart-http.service';
import { Skeleton } from '../shared/skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';
import { EncryptionService } from '../services/encryption.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-journal',
  imports: [Notebook, Skeleton],
  templateUrl: './journal.html',
  styleUrl: './journal.scss',
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
export class Journal implements OnInit {
  currentDate = signal<string>('');
  insightData = signal<any>({
    totalEntries: 0,
    totalWords: 0
  });
  loading = signal<boolean>(true);

  encryptionService = inject(EncryptionService);
  http = inject(SmartHttpService);
  private journal = inject(AnalyticsService);

  ngOnInit(): void {
    this.journal.track("Journal Page View");
    this.currentDate.set(format(new Date(), "EEEE, MMMM d, yyyy"))
    this.getInsightsData();
  }
  
  getInsightsData = () => {
    this.http.get("stats/journal").subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.insightData.set(resp.data);
          this.loading.set(false);
        }
      }
    })
  }
}
