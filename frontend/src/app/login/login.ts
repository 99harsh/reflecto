import { PLATFORM_ID, Inject, Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const google: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
// Declare google as a global variable

export class Login implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  isBrowser = false;
  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log(this.isBrowser, this.platformId);
    if (this.isBrowser) this.loadGoogleSDK();
  }

  loadGoogleSDK(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    (window as any).handleCredentialResponse = (response: any) => {
      console.log('Google token:', response.credential);
    };

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: '116553995051-9ji97ic0m1npdb0f99eamd45orbpj20d.apps.googleusercontent.com',
        callback: (window as any).handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large' }
      );
    };
  }
}
