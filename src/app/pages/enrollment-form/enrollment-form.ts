import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { CourseService } from '../../services/course';
import { EnrollmentService } from '../../services/enrollment';
import { Course } from '../../models/course.model';
import { Store } from '@ngrx/store';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import * as CourseActions from '../../store/course/course.actions';

@Component({
  selector: 'app-enrollment-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css'
})
export class EnrollmentForm {
  // Form model fields
  studentName = '';
  studentEmail = '';
  courseId: number | null = null;
  preferredSemester = 'Odd';
  agreeToTerms = false;

  submitted = false;

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private store: Store
  ) { }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Template Form Submitted!');
      console.log('Form Validity:', form.valid);
      console.log('Form Values Object Structure:', form.value);

      const newCoursePayload: Omit<Course, 'id'> = {
        name: `${this.studentName}'s Custom Class`,
        code: `CS${this.courseId}`,
        credits: 3,
        gradeStatus: 'pending',
        enrolled: false
      };

      // Perform POST call to JSON Server Course resource
      this.courseService.createCourse(newCoursePayload).subscribe({
        next: (createdCourse) => {
          console.log('Course successfully created on API:', createdCourse);
          this.submitted = true;

          // Enroll the student in this newly created page
          this.enrollmentService.enroll(createdCourse.id);
          this.store.dispatch(EnrollmentActions.enrollInCourse({ courseId: createdCourse.id }));
          this.store.dispatch(CourseActions.loadCourses());

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.submitted = false;
          }, 5000);
        },
        error: (err) => console.error('Failed to create course via API:', err)
      });
    }
  }
}
