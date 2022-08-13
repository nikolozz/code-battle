import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'code-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() message = '';
  @Input() isResponseModal?: boolean;

  @Output() closeAlert = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  public onClose() {
    this.closeAlert.emit();
  }

  public onAccept() {
    this.accept.emit();
  }

  public onReject() {
    this.reject.emit();
  }
}
