import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SingInRoutingModule } from './sing-in-routing.module';
import { SingInComponent } from './components/sing-in/sing-in.component';
import { NbInputModule } from '@nebular/theme';
import { NebularModule } from '../nebular/nebular.module';

@NgModule({
  declarations: [SingInComponent],
  imports: [
    CommonModule,
    SingInRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NebularModule,
  ],
})
export class SingInModule {}
