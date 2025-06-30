import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  imports: [],
  templateUrl: './progressbar.html',
  styleUrl: './progressbar.scss'
})
export class Progressbar {
 progress = input(0); // value from 0 to 100
}
