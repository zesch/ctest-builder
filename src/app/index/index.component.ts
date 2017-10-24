import { Component, OnInit, Input } from '@angular/core';
import { SubmitTextService } from "app/submit-text.service";
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material';

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
  selectedLanId: string = 'en';
  languages = [
    {value: 'en', viewValue: 'English'},
    {value: 'fr', viewValue: 'French'},
    {value: 'de', viewValue: 'German'}
  ];



  constructor(private submitTextService: SubmitTextService,
    private router: Router) {
   }

  ngOnInit() {
  }

  submit(){
    
    this.submitTextService.submitText1(this.text, this.selectedLanId );
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
