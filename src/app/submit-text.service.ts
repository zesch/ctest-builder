import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SubmitTextService {


  textSource1: string = '';


  submitText1(text: string) {
    this.textSource1 = text;
  }
  
}
