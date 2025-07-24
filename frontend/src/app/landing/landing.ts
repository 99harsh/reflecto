import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, Header, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {

}
