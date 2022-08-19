import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChallengeDuration, ChallengeLevel } from '@code-battle/api-types';

// TODO Move to libs
interface Room {
  level: ChallengeLevel;
  duration: ChallengeDuration;
  isPrivate: boolean;
}

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
    private dialogRef: MatDialogRef<Room>
  ) {}

  public ngOnInit() {
    this.form = this.formBuilder.group({
      difficulty: ['', Validators.required],
      duration: ['', Validators.required],
      accessibility: ['', Validators.required],
    });
  }

  public onClose(): void {
    return void 0;
  }

  public onSubmit(): void {
    return void 0;
  }
}
