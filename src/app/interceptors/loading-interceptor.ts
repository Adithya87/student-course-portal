import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Show spinner on request initiation
  loadingService.show();
  
  return next(req).pipe(
    // Hide spinner once request completes or errors (Hands-On 8 Step 91)
    finalize(() => {
      loadingService.hide();
    })
  );
};
