import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ChallengeCreate,
  ChallengeDuration,
  ChallengeLevel,
} from '@code-battle/common';

@Component({
  selector: 'code-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css'],
})
export class CreateRoomComponent implements OnInit {
  public title = 'Create a Challenge';
  public form!: FormGroup;

  public durations = ChallengeDuration;
  public levels = ChallengeLevel;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChallengeCreate>
  ) {}

  public ngOnInit() {
    this.form = this.formBuilder.group({
      level: ['', Validators.required],
      duration: ['', Validators.required],
      isPrivate: ['', Validators.required],
    });
  }

  public onClose(): void {
    return this.dialogRef.close();
  }

  public onSubmit(): void {
    return this.dialogRef.close(this.form.value);
  }
}
