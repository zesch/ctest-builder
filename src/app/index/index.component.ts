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
  text: string ='Please put in your text here.  Then hit the "Submit" button below.';
  clearTextCount: number = 1;
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

  clearText(){
    if(this.clearTextCount >= 1){
      this.text = '';
    }
    this.clearTextCount = this.clearTextCount - 1;
  }

  
}
