import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {

  constructor(public dialog: MatDialogRef<HelpPageComponent>) { }

  ngOnInit() {

  }

  public close() {
    this.dialog.close();
  }
}
