import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseState } from './course.reducer';

// Hands-On 9 Task 1 Step 95
export const selectCourseState = createFeatureSelector<CourseState>('course');

export const selectAllCourses = createSelector(
  selectCourseState,
  (state: CourseState) => state.courses
);

export const selectCoursesLoading = createSelector(
  selectCourseState,
  (state: CourseState) => state.loading
);

export const selectCoursesError = createSelector(
  selectCourseState,
  (state: CourseState) => state.error
);
