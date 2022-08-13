import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import * as ace from 'ace-builds';

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent implements AfterViewInit {
  @Output() codeChangedEvent = new EventEmitter<string>();
  @ViewChild('editor') private editor?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');

    if (!this.editor) {
      return;
    }

    const aceEditor = ace.edit(this.editor.nativeElement);

    aceEditor.session.setValue(`function(a, b) {
  // Your code goes here...
}`);
    aceEditor.session.setMode('ace/mode/javascript');

    aceEditor.on('change', () => {
      this.codeChangedEvent.emit(aceEditor.getValue());
    });
  }
}
