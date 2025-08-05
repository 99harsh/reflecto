import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SavingLoading } from '../shared/saving-loading/saving-loading';
import { Spinner } from '../shared/spinner/spinner';
import { SmartHttpService } from '../services/smart-http.service';
import { FormsModule } from '@angular/forms';
import { getRelativeTime } from '../shared/helper';

@Component({
  selector: 'app-mood',
  imports: [CommonModule, SavingLoading, Spinner, FormsModule],
  templateUrl: './mood.html',
  styleUrl: './mood.scss',
})
export class Mood implements OnInit {

  allMoods = signal<any>([]);
  userMood = signal<any | null>(null);
  selectedMoodID = signal<number>(-1);
  selectedIntensityLevel = signal<number>(1);
  loggedAt = signal<string>('')

  http = inject(SmartHttpService);

  ngOnInit(): void {
    this.getAllMoods();
  }

  getAllMoods = () => {
    this.http.get('mood/all').subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.allMoods.set(resp.data);
        }
      },
      complete: () => {
        this.getUserMood();
      }
    })
  }

  getUserMood = () => {
    this.http.get('mood/get').subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200 && resp.data !== null){
          const moodData = this.getMoodInfoFromID(resp.data.mood_id);
          this.userMood.set({...resp.data, mood: moodData[0]?.mood, mood_emoj: moodData[0]?.mood_emoj});
          console.log(this.userMood())
          this.selectedIntensityLevel.set(resp.data.intensity);
          this.selectedMoodID.set(resp.data.mood_id);
          this.loggedAt.set(getRelativeTime(resp.data.updated_at));
          console.log(this.loggedAt())
        }
      }
    });
  }

  updateMood = (mood_id: number) => {
    if(!this.userMood()?.mood_id){
      this.selectedMoodID.set(mood_id);
    }
  }

  updateIntensityLevel = (intensity:number) => {
    if(!this.userMood()?.intensity){
      this.selectedIntensityLevel.set(intensity);
    }
  }

  logMood = () => {
    if(this.selectedMoodID() !== -1 && this.selectedIntensityLevel()){
      this.http.post("mood/log", {
        mood_id: this.selectedMoodID(),
        intensity: this.selectedIntensityLevel()
      }).subscribe({
        next: (resp:any) => {
          if(resp && resp.status === 200){
            const moodData = this.getMoodInfoFromID(resp.data.mood_id);
            this.userMood.set({
              mood: moodData.mood,
              mood_emoj: moodData.mood_emoj,
              mood_id: this.selectedMoodID(),
              intensity: this.selectedIntensityLevel(),
              updated_at: resp.data.updated_at
            })
            this.loggedAt.set(getRelativeTime(resp.data.updated_at));
          }
        },
        
      })
    }
  }

  getMoodInfoFromID = (mood_id: number) => {
    return this.allMoods().filter((obj:any) => mood_id === obj.mood_id);
  }
  
}
