import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Course } from '../../models/course.model';
import * as CourseSelectors from '../../store/course/course.selectors';
import * as EnrollmentSelectors from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  /*
    DIFFERENCE BETWEEN [property] AND [(ngModel)]:
    - [property] (One-Way): Data flows from Component class property → DOM. Modifying the property updates the UI.
    - [(ngModel)] (Two-Way): Data flows bi-directionally (Component ↔ DOM). Changes in the component update the DOM, and user inputs (typing, selection changes) instantly update the component class property.
  */
  portalName = 'Student Course Portal';
  isPortalActive = true;
  message = '';
  searchTerm = '';

  // NgRx Store Selectors
  courses$: Observable<Course[]>;
  enrolledCourses$: Observable<Course[]>;

  constructor(private store: Store, private router: Router) {
    this.courses$ = this.store.select(CourseSelectors.selectAllCourses);
    this.enrolledCourses$ = this.store.select(EnrollmentSelectors.selectEnrolledCourses);
  }

  ngOnInit(): void {
    console.log('HomeComponent initialised — courses loaded');
  }

  ngOnDestroy(): void {
    console.log('HomeComponent destroyed');
  }

  onEnrollClick(): void {
    this.message = 'Enrollment opened!';
    this.router.navigate(['/courses']);
  }
}
