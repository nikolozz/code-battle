import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AlertData {
  title: string;
  message: string;
}

@Component({
  selector: 'code-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  message = '';
  title = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertData) {
    this.message = data.message;
    this.title = data.title;
  }
}
