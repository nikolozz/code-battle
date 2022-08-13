import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AlertComponent,
    LoaderComponent,
    CodeEditorComponent,
    HeaderComponent,
  ],
  exports: [
    AlertComponent,
    LoaderComponent,
    CodeEditorComponent,
    HeaderComponent,
  ],
})
export class UiModule {}
