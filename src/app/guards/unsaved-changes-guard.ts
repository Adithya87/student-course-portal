import { CanDeactivateFn } from '@angular/router';
import { ReactiveEnrollmentForm } from '../pages/reactive-enrollment-form/reactive-enrollment-form';

export const unsavedChangesGuard: CanDeactivateFn<ReactiveEnrollmentForm> = (
  component: ReactiveEnrollmentForm
) => {
  // If form is dirty and not yet submitted, prompt confirmation (Hands-On 7 Step 77)
  if (component.enrollForm && component.enrollForm.dirty && !component.submitted) {
    return window.confirm('You have unsaved changes. Leave?');
  }
  return true;
};
