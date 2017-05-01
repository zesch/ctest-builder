import { Injectable } from '@angular/core';


import { TextParser } from './text-parser';
import { Text } from './text';

@Injectable()
export class TextService {
  getParagraph(): Promise<Text[]>{
    return Promise.resolve(TextParser.getCTestText());
  }

  setParagraph(text: string): void {
    TextParser.setCTestText(text);
  }

  constructor() { }

}
