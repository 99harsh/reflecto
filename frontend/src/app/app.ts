import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BetaModeBar } from './beta-mode-bar/beta-mode-bar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BetaModeBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'HabitUp.app';
}
