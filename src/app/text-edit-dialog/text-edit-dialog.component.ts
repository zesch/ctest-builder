import { Component } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-text-edit-dialog',
  templateUrl: './text-edit-dialog.component.html',
  styleUrls: ['./text-edit-dialog.component.css']
})
export class TextEditDialogComponent  {

  constructor(public dialogRef: MdDialogRef<TextEditDialogComponent>) { }

 

}
