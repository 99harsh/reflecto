import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  if (/google/.test(req.url)) {
    return next(req); 
  }
  const cloned = req.clone({
    withCredentials: true
  });
  return next(cloned);
};
