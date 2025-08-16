import { Component, inject, OnInit, signal, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { SmartHttpService } from '../../services/smart-http.service';
import { Location } from '@angular/common';
import { Skeleton } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Skeleton],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  encapsulation: ViewEncapsulation.None
})
export class Landing implements OnInit {
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
      this.http.post("stats/date-insights", { date: this.dateParam() }).subscribe({
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

  goBack = () => {
    this.location.back();
  }


}
