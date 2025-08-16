import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SmartHttpService } from '../../services/smart-http.service';
import { format } from 'date-fns';
import { Skeleton } from '../skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
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
export class Calendar implements OnInit {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  loading = signal<boolean>(true);
  monthList = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );
  yearList: number[] = [];
  calendarDays = signal<any>([]);
  entries: any[] = [];
  private http = inject(SmartHttpService);
  router = inject(Router);

  ngOnInit(): void {
    const baseYear = new Date().getFullYear();
    this.yearList = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);
    this.fetchCalendarData();
  }

  fetchCalendarData = () => {
    this.http.get("stats/calendar").subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.calendarDays.set(resp.data);
          this.loading.set(false);
        }
      }
    })
  }

  generateCalendar(): void {

  }

  redirect = (day: any) => {
    if(day.daily_login){
      this.router.navigate(["/date-details/", format(new Date(day.fullDate), "MM-dd-yyyy")])
    }
  }
}