import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SubmitTextService {


  textSource1: string = '';
  LanID: string = '';

  submitText1(text: string, LanID: string) {
    this.textSource1 = text;
    this.LanID = LanID;
  }
  
}
