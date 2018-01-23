import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
@Component({
  selector: 'app-reformat-dialog',
  templateUrl: './reformat-dialog.component.html',
  styleUrls: ['./reformat-dialog.component.css']
})
export class ReformatDialogComponent implements OnInit {
  gapCount: number = 20;
  constructor(public dialogRef: MatDialogRef<ReformatDialogComponent>) { }

  ngOnInit() {
  }

}
