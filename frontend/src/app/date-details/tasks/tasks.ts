import { Component, inject, OnInit, signal } from '@angular/core';
import { SmartHttpService } from '../../services/smart-http.service';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { CommonModule, Location } from '@angular/common';
import { Skeleton } from '../../shared/skeleton/skeleton';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, Skeleton],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks implements OnInit {
  private http = inject(SmartHttpService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private analytics = inject(AnalyticsService);

  loading = signal<boolean>(true);

  dateParam = signal<string>("");
  currentDate = signal<string>("");
  insightData = signal<any>([]);
  totalTasks = signal<number>(0);
  completedTasks = signal<number>(0);

  ngOnInit(): void {
    this.fetchInsights();
  }

  private fetchInsights = () => {
    try {
      this.dateParam.set(this.route.snapshot.paramMap.get("date") || "");
      this.currentDate.set(format(new Date(this.dateParam()), "EEEE, MMMM d, yyyy"));
      this.analytics.track("Date Details Task Page View", {date: this.currentDate()});
      this.http.post("stats/task-insights", { date: this.dateParam() }).subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.loading.set(false);
            this.totalTasks.set(res.data?.length || 0);
            this.completedTasks.set((res.data?.filter((obj: any) => obj.completed))?.length || 0);
            this.insightData.set(res.data);
          }
        }
      })

    } catch (error) {
      alert(error);
    }
  }

  goBack = () => {
    this.location.back();
  }

}
