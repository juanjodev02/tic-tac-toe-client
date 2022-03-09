import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToastrModule,
  NbUserModule,
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
    NbUserModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbSpinnerModule,
    NbListModule,
    NbDialogModule.forRoot({
      closeOnEsc: false,
    }),
    NbToastrModule.forRoot(),
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
    NbUserModule,
    NbMenuModule,
    NbContextMenuModule,
    NbSpinnerModule,
    NbListModule,
    NbDialogModule,
    NbToastrModule,
  ],
})
export class NebularModule {}
