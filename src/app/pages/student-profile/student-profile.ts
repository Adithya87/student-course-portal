import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import * as EnrollmentSelectors from '../../store/enrollment/enrollment.selectors';
import * as CourseActions from '../../store/course/course.actions';
import * as CourseSelectors from '../../store/course/course.selectors';

@Component({
  selector: 'app-student-profile',
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile implements OnInit {
  studentName = 'nagasai';
  studentEmail = 'nagasai@college.edu';
  department = 'Electronics and Communication Engineering';
  semester = '7th Semester';
  gpa = 9.1;

  // Selected streams (Step 99)
  enrolledCourses$: Observable<Course[]>;
  completedCourses$: Observable<Course[]>;
  failedCourses$: Observable<Course[]>;

  constructor(private store: Store) {
    this.enrolledCourses$ = this.store.select(EnrollmentSelectors.selectEnrolledCourses);
    this.completedCourses$ = this.store.select(CourseSelectors.selectAllCourses).pipe(
      map(courses => courses.filter(c => c.gradeStatus.toLowerCase() === 'passed'))
    );
    this.failedCourses$ = this.store.select(CourseSelectors.selectAllCourses).pipe(
      map(courses => courses.filter(c => c.gradeStatus.toLowerCase() === 'failed'))
    );
  }

  ngOnInit(): void {
    // Ensure courses are loaded if user lands on profile directly
    this.store.dispatch(CourseActions.loadCourses());
  }

  unenroll(courseId: number): void {
    this.store.dispatch(EnrollmentActions.unenrollFromCourse({ courseId }));
    console.log(`Dispatched unenrollFromCourse action for course ID ${courseId} via StudentProfile`);
  }
}
