import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CoursesLayout } from './components/courses-layout/courses-layout';
import { CourseList } from './pages/course-list/course-list';
import { CourseDetail } from './pages/course-detail/course-detail';
import { StudentProfile } from './pages/student-profile/student-profile';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Home Page
  { path: '', component: Home, canActivate: [authGuard] },

  // Login Page
  { path: 'login', component: Login },


  // Nested routes under courses layout (Hands-On 7 Steps 68 & 72)
  {
    path: 'courses',
    component: CoursesLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: CourseList },
      { path: ':id', component: CourseDetail }
    ]
  },

  // Student Profile protected by AuthGuard (Hands-On 7 Steps 68 & 76)
  {
    path: 'profile',
    component: StudentProfile,
    canActivate: [authGuard]
  },

  // Lazy Loaded Enrollment Feature Module protected by AuthGuard (Hands-On 7 Steps 73 & 76)
  {
    path: 'enroll',
    loadChildren: () => import('./features/enrollment/enrollment-module').then(m => m.EnrollmentModule),
    canActivate: [authGuard]
  },

  // Wildcard NotFound Route (Hands-On 7 Step 68)
  { path: '**', component: NotFound }
];
