import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-journal',
  imports: [CommonModule, NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal implements OnInit {
  editor!: Editor;
  isEditor = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);
  editorText = signal<string>('<h2>Hello World</h2>');
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
    }
  }
}
