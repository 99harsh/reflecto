import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'app-saving-loading',
  imports: [CommonModule],
  templateUrl: './saving-loading.html',
  styleUrl: './saving-loading.scss'
})
export class SavingLoading {
  isLoading = input<boolean>(false);
  isUpdated = input<boolean | null>(null);
  updatedAt = input<string>('');

  get savedAt() {
    return format(new Date(this.updatedAt()), "dd-MMM hh:mm a");
  }
}
