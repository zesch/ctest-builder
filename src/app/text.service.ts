import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


import { Text } from './text';
import { TextParser } from './text-parser';


@Injectable()
export class TextService {

  private url = 'api/texts'; 
  constructor(private http: Http) { }


  // using web api
  getParagraph(): Promise<Text[]>{
    return this.http.get(this.url)
    .toPromise()
    .then(response => response.json().data as Text[])
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }





//in memory parser

  // getParagraph(): Promise<Text[]>{
  //   return Promise.resolve(TextParser.getCTestText());
  // }

  setParagraph(text: string): void {
    TextParser.setCTestText(text);
  }

  hideTextService(text: string): string{
    return TextParser.hideWord(text);
  }

  isSymbolsService(text: string): boolean{
    return TextParser.isSymbols(text);
  }


}
