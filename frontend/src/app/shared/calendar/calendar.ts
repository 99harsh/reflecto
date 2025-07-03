import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthList = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );
  yearList: number[] = [];

  calendarDays: any[] = [];
  entries: any[] = [];

  ngOnInit(): void {
    const baseYear = new Date().getFullYear();
    this.yearList = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);

    this.entries = [
      { date: new Date(this.currentYear, this.currentMonth, 3), mood: '😊' },
      { date: new Date(this.currentYear, this.currentMonth, 8), mood: '😞' },
      { date: new Date(this.currentYear, this.currentMonth, 15), mood: '😎' }
    ];

    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === this.currentMonth;
      const isToday = date.toDateString() === today.toDateString();
      const hasEntry = this.hasEntryForDate(date);

      this.calendarDays.push({
        date: date.getDate(),
        fullDate: date,
        isCurrentMonth,
        isToday,
        hasEntry,
        mood: hasEntry ? this.getMoodForDate(date) : null,
        streak: this.hasStreakForDate(date)
      });
    }
  }

  hasEntryForDate(date: Date): boolean {
    return this.entries.some(entry =>
      entry.date.toDateString() === date.toDateString()
    );
  }

  getMoodForDate(date: Date): string | null {
    const entry = this.entries.find(entry =>
      entry.date.toDateString() === date.toDateString()
    );
    return entry?.mood || null;
  }

  hasStreakForDate(date: Date): boolean {
    return Math.random() > 0.7;
  }

  getMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }
}
