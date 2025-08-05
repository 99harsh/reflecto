import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SavingLoading } from '../saving-loading/saving-loading';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { SmartHttpService } from '../../services/smart-http.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'app-notebook',
  imports: [CommonModule, FormsModule, SavingLoading, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './notebook.html',
  styleUrl: './notebook.scss',
  encapsulation: ViewEncapsulation.None
})
export class Notebook implements OnInit {
  @ViewChild("journalTextarea", { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>

  journalContent = ""
  lineCount = 25
  textareaRows = 25
  editor!: Editor;
  
  currentDate = signal<string>('');
  updatedAt = signal<string>('');
  isEditor = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  journalText = signal<string>('');
  journalData = signal<any>({});

  private platformId = inject(PLATFORM_ID);
  private http = inject(SmartHttpService);

  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.currentDate.set(format(new Date(), "EEEE, MMMM d, yyyy"));
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
    }
    this.fetchJournalData();
    this.registerSaveJournalListner();
  }

  fetchJournalData = () => {
    this.http.get("journal/get").subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.journalText.set(res.data?.journal);
          this.journalData.set(res.data)
        }
      }
    })
  }

  private registerSaveJournalListner() {
    this.inputSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )
      .subscribe((val) => {
        this.saveJournal(val);
      });
  }

  private saveJournal = (value:string) => {
    this.isSaving.set(true);
    this.http.post('journal/save', {
      journal_id: this.journalData()?.journal_id,
      journal: value
    }).subscribe({
      next: (resp:any) => {
        if(resp && resp.status === 200){
          this.journalData.set(resp.data);
          this.updatedAt.set(resp.data.updated_at);
        }
      },
      complete: () => {
        this.isSaving.set(false);
      }
    })
  }


  onTextChange = (value: string) => {
    if(value === this.journalText()) return;
    this.journalText.set(value);
    this.inputSubject.next(value);
  }

  getLineArray(): number[] {
    return Array(this.lineCount)
      .fill(0)
      .map((_, i) => i + 1)
  }

  getHoleArray(): number[] {
    return Array(Math.min(20, Math.floor(this.lineCount / 2.5)))
      .fill(0)
      .map((_, i) => i + 1)
  }

  trackByIndex(index: number): number {
    return index
  }


  ngOnDestroy() {
    if (this.isEditor()) {
      this.editor.destroy();
    }
  }
}
