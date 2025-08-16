import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SavingLoading } from '../shared/saving-loading/saving-loading';
import { SmartHttpService } from '../services/smart-http.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { format } from 'date-fns';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { Skeleton } from '../shared/skeleton/skeleton';
import { trigger, style, transition, animate } from '@angular/animations';

interface ReflectionLoading{
  isUserReflectionLoading:boolean,
  isStatsLoading: boolean,
  isReflectionPromptLoading: boolean
}

@Component({
  selector: 'app-reflection',
  standalone: true,
  imports: [CommonModule, SavingLoading, NgxEditorComponent, NgxEditorMenuComponent, FormsModule, Skeleton],
  templateUrl: './reflection.html',
  styleUrl: './reflection.scss',
  encapsulation: ViewEncapsulation.None,
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
export class Reflection implements OnInit {
  // Signals
  reflectionData = signal<any>({});
  reflectionText = signal<string>('');
  prompts = signal<any[]>([]);
  isSaving = signal<boolean>(false);
  editor!: Editor;
  isEditor = signal<boolean>(false);
  currentDate = signal<string>('');
  progress = signal<any>({});
  isLoading = signal<ReflectionLoading>({
    isUserReflectionLoading: true,
    isStatsLoading: true,
    isReflectionPromptLoading: true
  })
  private platformId = inject(PLATFORM_ID);
  //Service
  private http = inject(SmartHttpService);
  // RxJS Subjects
  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.currentDate.set(format(new Date(), "EEEE, MMMM d, yyyy"));
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
    }
    this.fetchPrompts();
    this.fetchReflection();
    this.registerSaveReflectionListener();
    this.fetchProgress();
  }

  /**
   * Listen for debounced input changes and auto-save
   */
  private registerSaveReflectionListener() {
    this.inputSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((val) => {
        console.log(val);
        this.saveReflection(val);
      });
  }

  /**
   * Save reflection data to server
   */
  private saveReflection(text: string) {
    this.isSaving.set(true);

    this.http
      .post('self-reflection/save', {
        self_reflection: text,
        self_reflection_id: this.reflectionData()?.self_reflection_id,
      })
      .subscribe({
        next: (resp: any) => {
          const updatedData = {
            ...this.reflectionData(),
            updated_at: format(new Date(resp.data?.updated_at), 'dd-MMM hh:mm a'),
            self_reflection_id: resp.data?.self_reflection_id,
          };
          this.reflectionData.set(updatedData);
        },
        error: (err) => {
          console.error('Error saving reflection:', err);
        },
        complete: () => this.isSaving.set(false),
      });
  }

  private fetchProgress(){
    this.http.get('stats/self-reflection').subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.progress.set(resp.data);
          this.isLoading.update((prev:ReflectionLoading) => ({
            ...prev,
            isStatsLoading: false
          }))
        }
      }
    })
  }

  /**
   * Fetch reflection prompts from server
   */
  private fetchPrompts() {
    this.http.get('prompt/all').pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        if (resp?.status === 200 && resp.data) {
          this.prompts.set(resp.data);
          this.isLoading.update((prev:ReflectionLoading) => ({
            ...prev,
            isReflectionPromptLoading: false
          }))
        }
      },
      error: (err) => console.error('Error fetching prompts:', err),
    });
  }

  /**
   * Fetch existing self reflection from server
   */
  private fetchReflection() {
    this.http.get('self-reflection/get').pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        if(resp && resp.status === 200){
             this.isLoading.update((prev:ReflectionLoading) => ({
            ...prev,
            isUserReflectionLoading: false
          }))
        }
        if (resp && resp.status === 200 && resp.data) {
          this.reflectionData.set({
            ...resp.data,
            updated_at: format(new Date(resp.data?.updated_at), 'dd-MMM hh:mm a'),
          });

          this.reflectionText.set(resp.data.self_reflection);
       
        }
      },
      error: (err) => console.error('Error fetching reflection:', err),
    });
  }

  /**
   * Triggered on textarea input
   */
  onTextChange(event: string) {
    if(event === this.reflectionText()) return;
    this.inputSubject.next(event);
    this.reflectionText.set(event);
  }

  /**
   * Cleanup
   */
  ngOnDestroy(): void {
    if(this.isEditor()){
       this.editor.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  addPromptToEditor = (prompt:string) => {
    if(this.reflectionText().trim().length <= 7){
      this.reflectionText.set( `<h3 style='color:#78350f; background-color: yellow; padding: .312rem'>${prompt}</h3><br />`);
      return;
    }
    this.reflectionText.set(`${this.reflectionText()}<h3 style='color:#78350f; background-color: yellow; padding: .312rem'>${prompt}</h3>`);
  }
}
