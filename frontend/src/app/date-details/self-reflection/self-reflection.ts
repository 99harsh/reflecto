import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Editor, NgxEditorComponent } from 'ngx-editor';
import { format } from 'date-fns';
import { SmartHttpService } from '../../services/smart-http.service';
import { Skeleton } from '../../shared/skeleton/skeleton';

@Component({
  selector: 'app-self-reflection',
  imports: [CommonModule, NgxEditorComponent, FormsModule, Skeleton],
  templateUrl: './self-reflection.html',
  styleUrl: './self-reflection.scss'
})
export class SelfReflection implements OnInit {
  editor!: Editor;

  isEditor = signal<boolean>(false);
  editorText = signal<string>('');
  dateParam = signal<string>("");
  currentDate = signal<string>("");
  insightData = signal<any>({});
  loading = signal<boolean>(true);

  private platformId = inject(PLATFORM_ID);
  private location = inject(Location);

  route = inject(ActivatedRoute);
  http = inject(SmartHttpService);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
      this.fetchInsights();
    }
  }



  private fetchInsights = () => {
    try {
      this.dateParam.set(this.route.snapshot.paramMap.get("date") || "");
      this.currentDate.set(format(new Date(this.dateParam()), "EEEE, MMMM d, yyyy"));
      this.http.post("stats/self-reflection-insights", { date: this.dateParam() }).subscribe({
        next: (res: any) => {
          if(res && res.status === 200){
            this.loading.set(false);
          }
          if (res && res.status === 200 && res.data) {
            this.editorText.set(res.data.self_reflection);
          }
        }
      })

    } catch (error) {
      alert(error);
    }
  }

  goBack = () => {
    this.location.back()
  }


}
