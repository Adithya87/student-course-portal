import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ErrorHandlerInterceptor: Caught HTTP Error', error);
      
      // Hands-On 8 Step 90
      if (error.status === 401) {
        console.warn('Unauthorized (401) request. Redirecting to home.');
        router.navigate(['/']);
      } else if (error.status === 500) {
        alert('Global Notification: Server Error (500). Please try again later.');
      }
      
      return throwError(() => error);
    })
  );
};
