import { createReducer, on } from '@ngrx/store';
import * as EnrollmentActions from './enrollment.actions';

// Hands-On 9 Task 2 Step 99
export interface EnrollmentState {
  enrolledCourseIds: number[];
}

export const initialState: EnrollmentState = {
  enrolledCourseIds: []
};

export const enrollmentReducer = createReducer(
  initialState,
  on(EnrollmentActions.enrollInCourse, (state, { courseId }) => {
    if (state.enrolledCourseIds.includes(courseId)) {
      return state;
    }
    return {
      ...state,
      enrolledCourseIds: [...state.enrolledCourseIds, courseId]
    };
  }),
  on(EnrollmentActions.unenrollFromCourse, (state, { courseId }) => ({
    ...state,
    enrolledCourseIds: state.enrolledCourseIds.filter(id => id !== courseId)
  })),
  on(EnrollmentActions.setEnrolledCourses, (state, { courseIds }) => ({
    ...state,
    enrolledCourseIds: [...courseIds]
  }))
);
