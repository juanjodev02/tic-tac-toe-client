import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SingInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { NebularModule } from '../nebular/nebular.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SingInRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NebularModule,
  ],
})
export class SingInModule {}
