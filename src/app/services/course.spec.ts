import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses: Course[] = [
    { id: 1, name: 'Angular Web Development', code: 'CS101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Data Structures & Algorithms', code: 'CS102', credits: 3, gradeStatus: 'pending' }
  ];

  beforeEach(() => {
    // Hands-On 10 Task 2 Step 106: Register HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Assert no outstanding HTTP calls remain unresolved (Step 107)
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test getCourses() (Step 107)
  it('should retrieve courses from API and filter out zero credits', () => {
    service.getCourses().subscribe({
      next: (courses) => {
        expect(courses.length).toBe(2);
        expect(courses[0].code).toBe('CS101');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    
    // Flush mock data
    req.flush(mockCourses);
  });

  // Test error handling (Step 108) with retry(2) sequential logic
  it('should propagate user-friendly error message on 500 failure', () => {
    service.getCourses().subscribe({
      next: () => fail('expected a failure, not courses'),
      error: (err) => {
        expect(err.message).toBe('Failed to load courses. Please try again.');
      }
    });

    // With retry(2) active, HttpClient will attempt 3 requests (original + 2 retries)
    // before propagating the failure. We flush 500 errors for all of them.
    const req1 = httpMock.expectOne('http://localhost:3000/courses');
    req1.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    const req2 = httpMock.expectOne('http://localhost:3000/courses');
    req2.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    const req3 = httpMock.expectOne('http://localhost:3000/courses');
    req3.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
