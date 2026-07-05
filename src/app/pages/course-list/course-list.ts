import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { CourseCard } from '../../components/course-card/course-card';
import { Highlight } from '../../directives/highlight';
import { Course } from '../../models/course.model';

// Store imports (Hands-On 9 Task 1 & 2)
import * as CourseActions from '../../store/course/course.actions';
import * as CourseSelectors from '../../store/course/course.selectors';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import * as EnrollmentSelectors from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, FormsModule, CourseCard, Highlight],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  // NgRx Store Observables
  courses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  enrolledIds$: Observable<number[]>;

  // Search filter subject (Hands-On 7 reactive search)
  searchTerm = '';
  private searchTermSubject = new BehaviorSubject<string>('');

  // Dropdown filter attributes
  gradeStatusFilter = 'all';
  private gradeStatusFilterSubject = new BehaviorSubject<string>('all');

  creditsFilter = 'all';
  private creditsFilterSubject = new BehaviorSubject<string>('all');

  enrollmentFilter = 'all';
  private enrollmentFilterSubject = new BehaviorSubject<string>('all');
  filteredCourses$: Observable<Course[]>;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Select selectors from NgRx Store (Steps 95 & 96 & 99)
    this.courses$ = this.store.select(CourseSelectors.selectAllCourses);
    this.isLoading$ = this.store.select(CourseSelectors.selectCoursesLoading);
    this.errorMessage$ = this.store.select(CourseSelectors.selectCoursesError);
    this.enrolledIds$ = this.store.select(EnrollmentSelectors.selectEnrolledIds);

    // Combine courses stream and all filter streams to filter dynamically
    this.filteredCourses$ = combineLatest([
      this.courses$,
      this.searchTermSubject.asObservable(),
      this.gradeStatusFilterSubject.asObservable(),
      this.creditsFilterSubject.asObservable(),
      this.enrollmentFilterSubject.asObservable(),
      this.enrolledIds$
    ]).pipe(
      map(([courses, term, status, credits, enrollStatus, enrolledIds]) => {
        const enrolledIdsList = enrolledIds || [];
        return courses.filter(c => {
          // 1. Search term match
          const search = term.trim().toLowerCase();
          const matchesSearch = !search ||
            c.name.toLowerCase().includes(search) ||
            c.code.toLowerCase().includes(search);

          // 2. Status match (passed, failed, pending)
          const matchesStatus = status === 'all' ||
            c.gradeStatus.toLowerCase() === status.toLowerCase();

          // 3. Credits match (2, 3, 4)
          const matchesCredits = credits === 'all' ||
            c.credits === parseInt(credits, 10);

          // 4. Enrollment status match
          const isEnrolled = enrolledIdsList.includes(c.id);
          const matchesEnrollment = enrollStatus === 'all' ||
            (enrollStatus === 'enrolled' && isEnrolled) ||
            (enrollStatus === 'not_enrolled' && !isEnrolled);

          return matchesSearch && matchesStatus && matchesCredits && matchesEnrollment;
        });
      })
    );
  }

  ngOnInit(): void {
    // Dispatch load courses action to trigger NgRx Effect (Hands-On 9 Task 1 Step 96)
    this.store.dispatch(CourseActions.loadCourses());

    // Read back query parameter 'search' (Hands-On 7 Step 71)
    this.route.queryParamMap.subscribe(params => {
      const search = params.get('search') || '';
      this.searchTerm = search;
      this.searchTermSubject.next(search);
    });
  }

  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }

  // Hands-On 9 Task 2 Step 100: Dispatch actions for enrollment changes
  onEnroll(courseId: number): void {
    // Read current enrolled state using first() to prevent synchronous recursion loop
    this.enrolledIds$.pipe(first()).subscribe(ids => {
      const isEnrolled = ids.includes(courseId);
      if (isEnrolled) {
        this.store.dispatch(EnrollmentActions.unenrollFromCourse({ courseId }));
        console.log(`Dispatched unenrollFromCourse action for course ID: ${courseId}`);
      } else {
        this.store.dispatch(EnrollmentActions.enrollInCourse({ courseId }));
        console.log(`Dispatched enrollInCourse action for course ID: ${courseId}`);
      }
    });
  }

  viewDetails(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  onSearchChange(): void {
    this.searchTermSubject.next(this.searchTerm);
    this.router.navigate(['/courses'], {
      queryParams: { search: this.searchTerm || null },
      queryParamsHandling: 'merge'
    });
  }

  onFilterChange(): void {
    this.gradeStatusFilterSubject.next(this.gradeStatusFilter);
    this.creditsFilterSubject.next(this.creditsFilter);
    this.enrollmentFilterSubject.next(this.enrollmentFilter);
  }
}
