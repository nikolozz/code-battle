import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent } from './alert/alert.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth.service';
import { AngularMaterialModule } from './angular-material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateRoomComponent } from './create-room/create-room.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
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
    CreateRoomComponent,
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
