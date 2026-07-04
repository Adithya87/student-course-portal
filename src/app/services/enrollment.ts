import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/enrollments';
  
  private enrolledCourseIds: number[] = [];
  private enrolledSubject = new BehaviorSubject<number[]>([]);
  enrolled$ = this.enrolledSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialEnrollments();
  }

  private loadInitialEnrollments(): void {
    // Load initial student 1 enrollments on startup
    this.http.get<any[]>(`${this.apiUrl}?studentId=1`).subscribe({
      next: (enrollments) => {
        this.enrolledCourseIds = enrollments.map(e => Number(e.courseId));
        this.enrolledSubject.next([...this.enrolledCourseIds]);
      },
      error: (err) => console.error('Failed to load initial enrollments:', err)
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  enroll(courseId: number): void {
    if (this.isEnrolled(courseId)) return;

    const payload = { studentId: '1', courseId: String(courseId) };
    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.enrolledCourseIds.push(courseId);
        this.enrolledSubject.next([...this.enrolledCourseIds]);
        console.log(`Enrollment successful for Course ID ${courseId}`);
      },
      error: (err) => console.error(`Failed to enroll in Course ID ${courseId}:`, err)
    });
  }

  unenroll(courseId: number): void {
    // Find enrollment record ID on server first
    this.http.get<any[]>(`${this.apiUrl}?studentId=1&courseId=${courseId}`).subscribe({
      next: (enrollments) => {
        if (enrollments && enrollments.length > 0) {
          const recordId = enrollments[0].id;
          this.http.delete<void>(`${this.apiUrl}/${recordId}`).subscribe({
            next: () => {
              this.enrolledCourseIds = this.enrolledCourseIds.filter(id => id !== courseId);
              this.enrolledSubject.next([...this.enrolledCourseIds]);
              console.log(`Unenrollment successful for Course ID ${courseId}`);
            },
            error: (err) => console.error(`Failed to delete enrollment record:`, err)
          });
        }
      },
      error: (err) => console.error(`Failed to find enrollment record for Course ID ${courseId}:`, err)
    });
  }

  // Get enrolled courses by filtering a source array
  getEnrolledCourses(courses: Course[]): Course[] {
    return courses.filter(c => this.enrolledCourseIds.includes(c.id));
  }

  // Hands-On 8 Step 87: Fetch students by course ID
  getStudentsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?courseId=${courseId}`);
  }
}
