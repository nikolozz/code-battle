import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AlertComponent } from './alert/alert.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth.service';
import { AngularMaterialModule } from './angular-material.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AngularMaterialModule,
  ],
  declarations: [
    AlertComponent,
    CodeEditorComponent,
    HeaderComponent,
    DashboardComponent,
  ],
  providers: [AuthService],
  exports: [
    AlertComponent,
    CodeEditorComponent,
    HeaderComponent,
    DashboardComponent,
    AngularMaterialModule,
  ],
})
export class UiModule {}
