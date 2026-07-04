import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';
import { errorHandlerInterceptor } from './interceptors/error-handler-interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';

import { courseReducer } from './store/course/course.reducer';
import { enrollmentReducer } from './store/enrollment/enrollment.reducer';
import { CourseEffects } from './store/course/course.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Register HttpClient and its interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor, 
        errorHandlerInterceptor, 
        loadingInterceptor
      ])
    ),

    // Hands-On 9 Task 1 Step 92 & 95: provideStore with Course and Enrollment state
    provideStore({
      course: courseReducer,
      enrollment: enrollmentReducer
    }),

    // Hands-On 9 Task 2 Step 97: provideEffects with CourseEffects
    provideEffects([CourseEffects]),

    // Chrome Redux DevTools integration (Step 92)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
