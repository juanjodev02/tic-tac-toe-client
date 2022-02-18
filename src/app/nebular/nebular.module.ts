import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbThemeModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbFormFieldModule,
    NbEvaIconsModule,
    NbIconModule,
  ],
  exports: [
    NbEvaIconsModule,
    NbThemeModule,
    NbLayoutModule,
    NbInputModule,
    NbCardModule,
    NbFormFieldModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
  ],
})
export class NebularModule {}
