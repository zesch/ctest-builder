import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
@Component({
  selector: 'app-reformat-dialog',
  templateUrl: './reformat-dialog.component.html',
  styleUrls: ['./reformat-dialog.component.css']
})
export class ReformatDialogComponent implements OnInit {
  gapCount: number = 20;
  constructor(public dialogRef: MdDialogRef<ReformatDialogComponent>) { }

  ngOnInit() {
  }

}
