import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule, CreditLabelPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard implements OnChanges {
  @Input() course!: {
    id: number;
    name: string;
    code: string;
    credits: number;
    gradeStatus: 'passed' | 'failed' | 'pending';
  };

  // Hands-On 9 Task 2 Step 100: Enrolled state passed via store select
  @Input() enrolled = false;

  @Output() enrollRequested = new EventEmitter<number>();
  @Output() viewDetailsRequested = new EventEmitter<number>();

  isExpanded = false;

  getCourseIcon(): string {
    if (!this.course) return '📚';
    const code = this.course.code.toUpperCase();
    if (code.includes('CS101')) return '💻';
    if (code.includes('CS102')) return '📊';
    if (code.includes('CS201')) return '🗄️';
    if (code.includes('CS301')) return '☁️';
    if (code.includes('CS401')) return '🤖';
    return '📚';
  }

  getCourseGradient(): string {
    if (!this.course) return 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)';
    const code = this.course.code.toUpperCase();
    if (code.includes('CS101')) return 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)';
    if (code.includes('CS102')) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (code.includes('CS201')) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    if (code.includes('CS301')) return 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
    if (code.includes('CS401')) return 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
    return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
  }


  get cardClasses() {
    return {
      'card--enrolled': this.enrolled === true,
      'card--full': this.course?.credits >= 4,
      'expanded': this.isExpanded
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      const prevVal = changes['course'].previousValue;
      const currVal = changes['course'].currentValue;
      console.log(`CourseCard [ID ${this.course?.id || 'new'}]: Course changed. Prev:`, prevVal, 'Curr:', currVal);
    }
  }

  toggleDetails(): void {
    this.isExpanded = !this.isExpanded;
  }
}
