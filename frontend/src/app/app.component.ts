import { Component } from '@angular/core';
import { StateManagementService } from './services/state-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'C-Test builder';

  constructor() {}
}