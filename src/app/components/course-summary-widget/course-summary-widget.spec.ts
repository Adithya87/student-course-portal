import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CourseSummaryWidget } from './course-summary-widget';

describe('CourseSummaryWidget', () => {
  let component: CourseSummaryWidget;
  let fixture: ComponentFixture<CourseSummaryWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSummaryWidget, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSummaryWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
