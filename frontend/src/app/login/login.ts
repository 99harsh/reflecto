import { PLATFORM_ID, Inject, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGoogleService } from '../services/auth-google.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
// Declare google as a global variable

export class Login implements OnInit {
  authService = inject(AuthGoogleService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  isBrowser = false;
  ngOnInit(): void {

  }

  loginWithGoogle = () =>{
    this.authService.login();
  }

}
