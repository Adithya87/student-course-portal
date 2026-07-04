import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CourseList } from './course-list';
import { Course } from '../../models/course.model';
import * as CourseActions from '../../store/course/course.actions';
import * as CourseSelectors from '../../store/course/course.selectors';
import * as EnrollmentSelectors from '../../store/enrollment/enrollment.selectors';

describe('CourseList', () => {
  let component: CourseList;
  let fixture: ComponentFixture<CourseList>;
  let store: MockStore;

  const mockCourses: Course[] = [
    { id: 1, name: 'Angular Web Development', code: 'CS101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Data Structures & Algorithms', code: 'CS102', credits: 3, gradeStatus: 'pending' }
  ];

  const initialState = {
    course: {
      courses: [],
      loading: false,
      error: null
    },
    enrollment: {
      enrolledCourseIds: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseList, HttpClientTestingModule],
      providers: [
        // Provide mock store (Hands-On 10 Task 2 Step 109)
        provideMockStore({ initialState }),
        // Provide router config to support navigation
        provideRouter([]),
        // Mock ActivatedRoute query parameters
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => null
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    
    // Setup selectors default mock values
    store.overrideSelector(CourseSelectors.selectAllCourses, mockCourses);
    store.overrideSelector(CourseSelectors.selectCoursesLoading, false);
    store.overrideSelector(CourseSelectors.selectCoursesError, null);
    store.overrideSelector(EnrollmentSelectors.selectEnrolledIds, []);

    spyOn(store, 'dispatch'); // Spy on store dispatching actions
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify action dispatch (Step 109)
  it('should dispatch loadCourses action on ngOnInit', () => {
    expect(store.dispatch).toHaveBeenCalledWith(CourseActions.loadCourses());
  });

  // Verify store selectors mapping to DOM
  it('should select courses from Store and render cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-course-card'));
    expect(cards.length).toBe(2);
  });
});
