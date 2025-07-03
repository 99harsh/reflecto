import { Component } from '@angular/core';
import { XpContainer } from '../shared/xp-container/xp-container';
import { Spinner } from '../shared/spinner/spinner';

@Component({
  selector: 'app-profile',
  imports: [XpContainer, Spinner],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

}
