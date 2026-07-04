import { createReducer, on } from '@ngrx/store';
import { Course } from '../../models/course.model';
import * as CourseActions from './course.actions';

// Hands-On 9 Task 1 Step 94
export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null
};

export const courseReducer = createReducer(
  initialState,
  on(CourseActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CourseActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses: courses,
    loading: false
  })),
  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    error: error,
    loading: false
  }))
);
