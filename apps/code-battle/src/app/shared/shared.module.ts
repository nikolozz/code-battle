import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    LoaderComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    AlertComponent,
  ]
})
export class SharedModule { }
