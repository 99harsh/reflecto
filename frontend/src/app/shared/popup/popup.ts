import { Component,  HostListener,  input,  Input, output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.scss',
   animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate(
          '250ms ease-out',
          style({ transform: 'scale(1)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'scale(0.8)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class Popup {
  isOpen = input<boolean>(false);
  closed = output();
  isBackdropLocked = input<boolean>(true);
  width = input<string>("");
  closePopup = () => {
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event']) keyBoardEvent(event:KeyboardEvent){
    if(this.isOpen() && event.code === 'Escape'){
        this.closed.emit()
    }
  }
}
