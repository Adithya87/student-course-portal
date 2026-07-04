import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-summary-widget',
  imports: [CommonModule],
  templateUrl: './course-summary-widget.html',
  styleUrl: './course-summary-widget.css'
})
export class CourseSummaryWidget implements OnInit, OnDestroy {
  courses: Course[] = [];
  private sub = new Subscription();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadCourses(): void {
    this.sub.add(
      this.courseService.getCourses().subscribe({
        next: (courses) => {
          this.courses = courses;
        },
        error: (err) => console.error('CourseSummaryWidget failed to load courses:', err)
      })
    );
  }

  addDummyCourse(): void {
    const nextId = Math.max(0, ...this.courses.map(c => c.id)) + 1;
    const newCourse: Omit<Course, 'id'> = {
      name: `Special Elective ${nextId}`,
      code: `EL${100 + nextId}`,
      credits: Math.floor(Math.random() * 3) + 2, // 2, 3, or 4 credits
      gradeStatus: 'pending',
      enrolled: false
    };
    
    // Add the course to the server database
    this.courseService.createCourse(newCourse).subscribe({
      next: (createdCourse) => {
        console.log('Added course via CourseSummaryWidget:', createdCourse);
        // Reload course list
        this.loadCourses();
      },
      error: (err) => console.error('CourseSummaryWidget failed to create course:', err)
    });
  }
}
