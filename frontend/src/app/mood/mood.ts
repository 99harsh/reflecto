import { CommonModule } from '@angular/common';
import {   Component } from '@angular/core';
import { SavingLoading } from '../shared/saving-loading/saving-loading';
import { Spinner } from '../shared/spinner/spinner';

@Component({
  selector: 'app-mood',
  imports: [CommonModule, SavingLoading, Spinner],
  templateUrl: './mood.html',
  styleUrl: './mood.scss',
})
export class Mood {

  currentMood: string = 'amazing';

  updateMood = (mood:string) => {
    this.currentMood = mood;
  }

}
