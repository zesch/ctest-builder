import { Injectable } from '@angular/core';

import { Text } from './text';
import { TextParser } from './text-parser';


@Injectable()
export class TextService {
  getParagraph(): Promise<Text[]>{
    return Promise.resolve(TextParser.getCTestText());
  }

  setParagraph(text: string): void {
    TextParser.setCTestText(text);
  }

  hideTextService(text: string): string{
    return TextParser.hideWord(text);
  }

  isSymbolsService(text: string): boolean{
    return TextParser.isSymbols(text);
  }
  constructor() { }

}
