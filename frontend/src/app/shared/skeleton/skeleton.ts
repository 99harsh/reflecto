import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss'
})
export class Skeleton {
  width = input('20px');
  height = input('50px');
  color = input('rfto-purple');
}
