import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';


import { Text } from './text';
import { Token } from './token';
import { TextParser } from './text-parser';
import { HttpHeaders } from '@angular/common/http';



@Injectable()
export class TextService {

  private url = 'api/tokens'; 
  private url2 = 'http://134.91.18.133:9000/demo/webapi/myresource';
  private urlLocal = 'http://localhost:8080/demo/webapi/myresource';
  private urlLangId = 'http://134.91.18.133:9000/demo/webapi/langId';
  private urlLangIdLocal = 'http://localhost:8080/demo/webapi/langId';
  constructor(private http: Http) { }


  // using web api
  // getApiResult(): Promise<Token[]>{
  //   return this.http.get(this.url)
  //   .toPromise()
  //   .then(response => response.json().data as Token[])
  //   .catch(this.handleError);
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getApiResult(text: string, lanId:string): Promise<Token[]>{

    let headers      = new Headers({ 'Content-Type': 'application/json' });
    let options       = new RequestOptions({ headers: headers });
    let body = {"text": text, "LanID": "en"}

//edit the url here to toggle between local dev server and prod server
    return this.http.post(this.url2, text, {
      params: {LanID: lanId}
    })
    .toPromise()
    .then(response => response.json() as Token[])
    .catch(this.handleError);
  }


  getLangId(text: string): Promise<string>{
    
    return this.http.post(this.urlLangId, text)
    .toPromise()
    .then(res => res.text() as string)
    .catch(this.handleError);
  }



//in memory parser
  // setParagraph(tokenized: Token[]): void {
  //   TextParser.setCTestText(tokenized);
  // }

  // getParagraph(): Promise<Text[]>{
  //   return Promise.resolve(TextParser.getCTestText());
  // }

  hideTextService(text: string, offset: number): string{
    return TextParser.hideWord(text, offset);
  }

  isSymbolsService(text: string): boolean{
    return TextParser.isSymbols(text);
  }

  gapService(tokens: Token[]): string[]{
    return TextParser.gapTokens(tokens);
  }

}
