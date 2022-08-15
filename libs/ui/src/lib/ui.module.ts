import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule],
  declarations: [
    AlertComponent,
    LoaderComponent,
    CodeEditorComponent,
    HeaderComponent,
  ],
  providers: [AuthService],
  exports: [
    AlertComponent,
    LoaderComponent,
    CodeEditorComponent,
    HeaderComponent,
  ],
})
export class UiModule {}
