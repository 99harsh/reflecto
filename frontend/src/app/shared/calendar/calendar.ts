import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit{
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthStats = {
    entries: 15,
    streak: 7,
    bestMood: '😊 Happy'
  };
  calendarDays: any[] = [];
  entries: any[] = [];
  ngOnInit(): void {

    this.entries = [];
    this.generateCalendar();

  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
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
    // Mock streak logic - in real app, this would be calculated
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
