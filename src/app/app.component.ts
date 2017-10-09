import { Component } from '@angular/core';
import 'hammerjs';
import { SubmitTextService } from "app/submit-text.service";





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SubmitTextService],
  
})
export class AppComponent {
  title = 'C Test Builder v1.00';

}
