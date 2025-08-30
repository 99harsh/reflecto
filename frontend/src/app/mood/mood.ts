import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SmartHttpService } from '../services/smart-http.service';
import { FormsModule } from '@angular/forms';
import { getRelativeTime } from '../shared/helper';
import { Skeleton } from '../shared/skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';
import { AnalyticsService } from '../services/analytics.service';

interface MoodLoading{
  isAllMoods:boolean,
  userMood: boolean,
  moodStats: boolean
}

@Component({
  selector: 'app-mood',
  imports: [CommonModule,  FormsModule, Skeleton],
  templateUrl: './mood.html',
  styleUrl: './mood.scss',
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
export class Mood implements OnInit {

  
  allMoods = signal<any>([]);
  userMood = signal<any | null>(null);
  selectedMoodID = signal<number>(-1);
  selectedIntensityLevel = signal<number>(1);
  loggedAt = signal<string>('')
  loading = signal<MoodLoading>({
    isAllMoods: true,
    userMood: true,
    moodStats: true
  });
  statsData = signal<any>({});
  private http = inject(SmartHttpService);
  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.track("Mood Page View");
    this.getAllMoods();
    this.getMoodStats();
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
        if(resp && resp.status){
           this.loading.update((prev:MoodLoading) => ({
            ...prev,
            isAllMoods: false
          }))
        }
        if(resp && resp.status === 200){
           this.loading.update((prev:MoodLoading) => ({...prev, userMood: false}))
        }
        if(resp && resp.status === 200 && resp.data !== null){
          const moodData = this.getMoodInfoFromID(resp.data.mood_id);
          this.userMood.set({...resp.data, mood: moodData[0]?.mood, mood_emoj: moodData[0]?.mood_emoj});
          this.selectedIntensityLevel.set(resp.data.intensity);
          this.selectedMoodID.set(resp.data.mood_id);
          this.loggedAt.set(getRelativeTime(resp.data.updated_at));
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
            const moodData = this.getMoodInfoFromID(this.selectedMoodID());
            this.userMood.set({
              mood: moodData[0].mood,
              mood_emoj: moodData[0].mood_emoj,
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

  getMoodStats = () => {
    this.http.get("stats/mood").subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.statsData.set(resp.data);
          this.loading.update((prev:MoodLoading) => ({
            ...prev,
            moodStats: false
          }))
        }
      }
    })
  }

  getMoodInfoFromID = (mood_id: number) => {
    return this.allMoods().filter((obj:any) => mood_id === obj.mood_id);
  }
  
}
