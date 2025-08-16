import { Component, inject, OnInit, signal } from '@angular/core';
import { Progressbar } from '../../shared/progressbar/progressbar';
import { ActivatedRoute } from '@angular/router';
import { SmartHttpService } from '../../services/smart-http.service';
import { format } from 'date-fns'
import { Location } from '@angular/common';
import { Skeleton } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-mood',
  imports: [Progressbar, Skeleton],
  templateUrl: './mood.html',
  styleUrl: './mood.scss'
})
export class Mood implements OnInit {
  dateParam = signal<string>("");
  currentDate = signal<string>("");
  insightData = signal<any>({});
  loading = signal<boolean>(true);

  route = inject(ActivatedRoute);
  http = inject(SmartHttpService);

    private location = inject(Location);

  ngOnInit(): void {
    this.fetchInsights();
  }

  private fetchInsights = () => {
    try {
      this.dateParam.set(this.route.snapshot.paramMap.get("date") || "");
      this.currentDate.set(format(new Date(this.dateParam()), "EEEE, MMMM d, yyyy"));
      this.http.post("stats/mood-insights", { date: this.dateParam() }).subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.insightData.set(res.data);
            this.loading.set(false);
          }
        }
      })

    } catch (error) {
      alert(error);
    }
  }

  get moodProgress() {
    return (this.insightData().intensity / 10) * 100
  }

  get loggedAt() {
    const updatedAt = this.insightData()?.updated_at;
    return updatedAt
      ? format(new Date(updatedAt), "MMM dd, yyyy hh:mm a")
      : "N/A";
  }

  goBack = () => {
    this.location.back();
  }


}
