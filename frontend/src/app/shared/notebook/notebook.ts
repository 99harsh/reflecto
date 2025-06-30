import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notebook',
  imports: [CommonModule, FormsModule],
  templateUrl: './notebook.html',
  styleUrl: './notebook.scss'
})
export class Notebook {
  journalContent = ""
  currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  lineCount = 25 // Start with 25 lines
  textareaRows = 25

  onContentChange(event: any) {
    this.journalContent = event.target.value
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // Add more lines when Enter is pressed
      setTimeout(() => {
        this.lineCount += 5
        this.textareaRows += 5
      }, 100)
    }
  }

  saveEntry() {
    console.log("Saving journal entry:", this.journalContent)
    alert("Journal entry saved!")
  }

  clearEntry() {
    this.journalContent = ""
    // Reset to original size
    this.lineCount = 25
    this.textareaRows = 25
  }

  getLineArray() {
    return Array(this.lineCount)
      .fill(0)
      .map((_, i) => i + 1)
  }

  getHoleArray() {
    return Array(Math.min(20, Math.floor(this.lineCount / 2)))
      .fill(0)
      .map((_, i) => i + 1)
  }
}
