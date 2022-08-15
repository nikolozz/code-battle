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
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
  ],
  declarations: [
    AlertComponent,
    CodeEditorComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
  ],
  providers: [AuthService],
  exports: [
    AlertComponent,
    CodeEditorComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    AngularMaterialModule,
  ],
})
export class UiModule {}
