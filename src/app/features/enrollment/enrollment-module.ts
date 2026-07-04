import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentRoutingModule } from './enrollment-routing-module';
import { EnrollmentForm } from '../../pages/enrollment-form/enrollment-form';
import { ReactiveEnrollmentForm } from '../../pages/reactive-enrollment-form/reactive-enrollment-form';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    EnrollmentForm,
    ReactiveEnrollmentForm
  ]
})
export class EnrollmentModule { }
