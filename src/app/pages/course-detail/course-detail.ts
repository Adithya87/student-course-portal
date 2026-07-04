import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CourseService } from '../../services/course';
import { EnrollmentService } from '../../services/enrollment';
import { Course } from '../../models/course.model';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, CreditLabelPipe],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetail implements OnInit {
  course: Course | undefined;
  enrolledStudents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    // Hands-On 8 Step 87: Chaining route param with switchMap to load enrolled students
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam) {
          const courseId = Number(idParam);
          
          // 1. Fetch course details
          return this.courseService.getCourseById(courseId).pipe(
            switchMap(course => {
              this.course = course;
              // 2. Fetch enrolled students for this course
              return this.enrollmentService.getStudentsByCourse(courseId);
            }),
            catchError(err => {
              console.error('CourseDetail failed loading course details:', err);
              return of([]); // fallback if error
            })
          );
        }
        return of([]);
      })
    ).subscribe({
      next: (students) => {
        this.enrolledStudents = students;
      }
    });

    /*
      WHY switchMap CANCELS THE PREVIOUS INNER OBSERVABLE:
      - switchMap is a flattening operator. When the outer source (route paramMap) emits a new value 
        (e.g., the user clicks a different course card), switchMap immediately unsubscribes from 
        the previous inner observable (the HTTP request for the previous course's students) 
        and subscribes to the new inner observable.
      - This prevents race conditions, ensuring that slow backend responses from earlier requests 
        do not overwrite newer, relevant data.
    */
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
