import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Token } from 'app/token';

@Injectable()
export class SubmitTextService {


  textSource1: string = '';
  LanID: string = '';
  isNewText: boolean = false;
  tokens: string;


  submitText1(text: string, LanID: string) {
    this.textSource1 = text;
    this.LanID = LanID;
    this.isNewText = true;
  }
  submitReimported(arg0: any): any {
    this.tokens = arg0;
  }

}
