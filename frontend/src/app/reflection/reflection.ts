import { Component } from '@angular/core';
import { SavingLoading } from '../shared/saving-loading/saving-loading';
import { Spinner } from '../shared/spinner/spinner';

@Component({
  selector: 'app-reflection',
  imports: [SavingLoading, Spinner],
  templateUrl: './reflection.html',
  styleUrl: './reflection.scss'
})
export class Reflection {

}
