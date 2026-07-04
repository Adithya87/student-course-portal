import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CourseCard } from './course-card';
import { Course } from '../../models/course.model';

describe('CourseCard', () => {
  let component: CourseCard;
  let fixture: ComponentFixture<CourseCard>;

  const mockCourse: Course = {
    id: 1,
    name: 'Data Structures',
    code: 'CS101',
    credits: 4,
    gradeStatus: 'passed'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCard]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCard);
    component = fixture.componentInstance;
    component.course = mockCourse; // Initialise required input
    fixture.detectChanges();
  });

  // 1. Creation test (Step 102)
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 2. Input rendering test (Step 103)
  it('should render course name in template', () => {
    component.course = {
      id: 1,
      name: 'Data Structures',
      code: 'CS101',
      credits: 4,
      gradeStatus: 'passed'
    };
    fixture.detectChanges();
    
    const titleElement = fixture.debugElement.query(By.css('.course-name')).nativeElement;
    expect(titleElement.textContent).toContain('Data Structures');
  });

  // 3. Output emission test (Step 104)
  it('should emit enrollRequested with course id when enroll button is clicked', () => {
    spyOn(component.enrollRequested, 'emit');
    
    // Find the enroll button
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const enrollBtn = buttons.find(btn => btn.nativeElement.textContent.includes('Enroll') || btn.nativeElement.textContent.includes('Unenroll'));
    
    expect(enrollBtn).toBeTruthy();
    enrollBtn!.nativeElement.click();
    fixture.detectChanges();
    
    expect(component.enrollRequested.emit).toHaveBeenCalledWith(1);
  });

  // 4. ngOnChanges lifecycle test (Step 105)
  it('should log changes on ngOnChanges', () => {
    spyOn(console, 'log');
    
    const changesObj: SimpleChanges = {
      course: new SimpleChange(null, mockCourse, true)
    };
    
    component.ngOnChanges(changesObj);
    
    expect(console.log).toHaveBeenCalled();
    const mostRecentCall = (console.log as jasmine.Spy).calls.mostRecent();
    expect(mostRecentCall.args[0]).toContain('CourseCard [ID 1]: Course changed');
  });

  // 5. Test cardClasses computed property
  it('should calculate correct card classes based on enrolled input', () => {
    component.enrolled = true;
    component.course = { ...mockCourse, credits: 4 };
    fixture.detectChanges();
    
    expect(component.cardClasses['card--enrolled']).toBeTrue();
    expect(component.cardClasses['card--full']).toBeTrue();
    
    component.enrolled = false;
    fixture.detectChanges();
    expect(component.cardClasses['card--enrolled']).toBeFalse();
  });
});
