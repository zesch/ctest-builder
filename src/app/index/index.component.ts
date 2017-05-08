import { Component, OnInit } from '@angular/core';
import {MdButtonToggleModule} from '@angular/material';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  simpleDrop: boolean;
  constructor() { }

  ngOnInit() {
  }

}
