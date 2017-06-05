import { Component, OnInit, Input } from '@angular/core';
import { SubmitTextService } from "app/submit-text.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: []
})
export class IndexComponent implements OnInit {
  simpleDrop: boolean;
  text: string;
  constructor(private submitTextService: SubmitTextService,
    private router: Router) {
   }

  ngOnInit() {
  }

  submit(){
    
    this.submitTextService.submitText1(this.text);
    console.log(this.text + ' is recieved');
    this.router.navigate(['/edit']);
  }
}
