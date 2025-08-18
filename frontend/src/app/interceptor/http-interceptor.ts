import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  if (/google/.test(req.url)) {
    return next(req);
  }

  const toastr = inject(ToastrService);
  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true
  }); 
  const toastrOptions = {
    closeButton: true,  
    timeOut: 10000,
    progressBar: true
  };
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 200) {
        switch (error.status) {
          case 401:
            toastr.error('Unauthorized. Please login again.', 'Error', toastrOptions);
            router.navigate(['/login']);
            break;
          case 500:
            toastr.error('Server error. Please try again later.', 'Error', toastrOptions);
            break;
          default:
            toastr.error('Something went wrong. Please try again.', 'Error', toastrOptions);
        }
      }
      localStorage.removeItem("user_profile");
      return throwError(() => error);
    }));
};
