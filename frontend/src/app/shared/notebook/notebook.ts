import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SavingLoading } from '../saving-loading/saving-loading';

@Component({
  selector: 'app-notebook',
  imports: [CommonModule, FormsModule, SavingLoading],
  templateUrl: './notebook.html',
  styleUrl: './notebook.scss'
})
export class Notebook implements AfterViewInit{
  @ViewChild("journalTextarea", { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>

  journalContent = ""
  currentDate: any;
  lineCount = 25
  textareaRows = 25
  private expandTimeout: any

  constructor(private cdr: ChangeDetectorRef) {
    // Initialize date in constructor to avoid expression changed error
   
  }

  ngAfterViewInit(): void {
       this.currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    this.cdr.detectChanges();
  }

  onContentChange(event: Event) {
    const target = event.target as HTMLTextAreaElement
    this.journalContent = target.value
  }

  onKeyPress(event: KeyboardEvent) {
    
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

  saveEntry() {
    if (this.journalContent.trim()) {
      alert("Journal entry saved!")
    }
  }

  clearEntry() {
    this.journalContent = ""
    this.lineCount = 25
    this.textareaRows = 25
  }

  ngOnDestroy() {
    // Clean up timeout on component destroy
    if (this.expandTimeout) {
      clearTimeout(this.expandTimeout)
    }
  }
}
