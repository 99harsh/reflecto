import { Component, inject, OnInit } from '@angular/core';
import { AuthGoogleService } from '../services/auth-google.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.scss'
})
export class Callback implements OnInit {
  private authService = inject(AuthGoogleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
      this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const idToken:string = params.get('id_token') || "";
        const state = params.get('state');

        // Optionally: validate tokens and send to backend
        this.authService.authenticate(idToken).subscribe((res:any) => {
          if(res.status === 200){
             this.authService.setUser(res.data);
            localStorage.setItem("user_profile", JSON.stringify(res.data));
            this.router.navigate(['/home'])
          }
        })
      }
    });
  }
}
