import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, retry } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  // Hands-On 8 Task 1 & 2: HTTP Client + RxJS operators
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      // Retry failed HTTP requests up to 2 times before propagating (Step 86)
      retry(2),
      // Tap for side effects like logging (Step 85)
      tap(courses => console.log('Courses loaded from HTTP:', courses.length)),
      // Map to transform the response (filter only courses with credits > 0) (Step 83)
      map(courses => courses.filter(c => c.credits > 0)),
      // Catch and propagate errors (Step 84)
      catchError(err => this.handleError(err, 'Failed to load courses. Please try again.'))
    );
  }

  /*
    WHY tap IS PREFERRED OVER SIDE EFFECTS INSIDE map:
    - tap is specifically designed for "side effects" (logging, caching, analytics) that should 
      NOT mutate the stream's data. It keeps the data pipeline clean and predictable.
    - map is strictly designed for "transformation". Modifying outside variables or logging 
      inside map violates the single-responsibility principle of functional programming 
      and can make debugging harder.
  */

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      retry(2),
      catchError(err => this.handleError(err, `Failed to load course details for ID ${id}.`))
    );
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      catchError(err => this.handleError(err, 'Failed to create course.'))
    );
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      catchError(err => this.handleError(err, 'Failed to update course.'))
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.handleError(err, 'Failed to delete course.'))
    );
  }

  private handleError(error: HttpErrorResponse, userFriendlyMsg: string) {
    console.error('CourseService caught error:', error);
    return throwError(() => new Error(userFriendlyMsg));
  }
}
