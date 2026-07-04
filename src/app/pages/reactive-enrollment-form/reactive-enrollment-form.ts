import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { CourseService } from '../../services/course';
import { EnrollmentService } from '../../services/enrollment';
import { Course } from '../../models/course.model';

import { Store } from '@ngrx/store';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import * as CourseActions from '../../store/course/course.actions';

// Custom Synchronous Validator
export function noCourseCode(control: AbstractControl): ValidationErrors | null {
  if (control.value && String(control.value).toUpperCase().startsWith('XX')) {
    return { noCourseCode: true };
  }
  return null;
}

// Custom Asynchronous Validator
export const simulateEmailCheck: AsyncValidatorFn = (control: AbstractControl): Promise<ValidationErrors | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const email = String(control.value || '').toLowerCase();
      if (email.includes('test@')) {
        resolve({ emailTaken: true });
      } else {
        resolve(null);
      }
    }, 800);
  });
};

@Component({
  selector: 'app-reactive-enrollment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.html',
  styleUrl: './reactive-enrollment-form.css'
})
export class ReactiveEnrollmentForm implements OnInit {
  enrollForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.enrollForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentEmail: ['', [Validators.required, Validators.email], [simulateEmailCheck]],
      courseId: ['', [Validators.required, noCourseCode]],
      preferredSemester: ['Odd', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      additionalCourses: this.fb.array([])
    });
  }

  // Typed getter for FormArray
  get additionalCourses(): FormArray {
    return this.enrollForm.get('additionalCourses') as FormArray;
  }

  addCourse(): void {
    this.additionalCourses.push(this.fb.control('', Validators.required));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  onSubmit(): void {
    if (this.enrollForm.valid) {
      const formValue = this.enrollForm.value;

      // Hands-On 8 Step 81: Map form values to new course payload
      const newCoursePayload: Omit<Course, 'id'> = {
        name: `${formValue.studentName}'s Custom Class`,
        code: formValue.courseId,
        credits: 3,
        gradeStatus: 'pending',
        enrolled: false
      };

      // Perform POST call to JSON Server Course resource
      this.courseService.createCourse(newCoursePayload).subscribe({
        next: (createdCourse) => {
          console.log('Course successfully created on API:', createdCourse);
          this.submitted = true;

          // Enroll the student in this newly created course
          this.enrollmentService.enroll(createdCourse.id);
          this.store.dispatch(EnrollmentActions.enrollInCourse({ courseId: createdCourse.id }));

          // Process additional courses
          const additionalCodes = formValue.additionalCourses || [];
          additionalCodes.forEach((code: string) => {
            if (code) {
              const addPayload: Omit<Course, 'id'> = {
                name: `${formValue.studentName}'s Additional Class`,
                code: code,
                credits: 3,
                gradeStatus: 'pending',
                enrolled: false
              };
              this.courseService.createCourse(addPayload).subscribe({
                next: (addCourse) => {
                  this.enrollmentService.enroll(addCourse.id);
                  this.store.dispatch(EnrollmentActions.enrollInCourse({ courseId: addCourse.id }));
                  this.store.dispatch(CourseActions.loadCourses());
                }
              });
            }
          });

          this.store.dispatch(CourseActions.loadCourses());

          // Debug output values (Hands-On 5 Task 1 Step 51)
          console.log('enrollForm.value:', this.enrollForm.value);
          console.log('enrollForm.getRawValue():', this.enrollForm.getRawValue());

          setTimeout(() => {
            this.submitted = false;
          }, 5000);
        },
        error: (err) => console.error('Failed to create course via API:', err)
      });
    }
  }

  onReset(): void {
    this.enrollForm.reset({
      preferredSemester: 'Odd',
      agreeToTerms: false
    });
    this.additionalCourses.clear();
    this.submitted = false;
  }
}
