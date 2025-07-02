import { Component } from '@angular/core';
import { Notebook } from '../shared/notebook/notebook';

@Component({
  selector: 'app-journal',
  imports: [Notebook],
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal {

}
