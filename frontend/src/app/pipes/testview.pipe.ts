import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'testview'
})
export class TestviewPipe implements PipeTransform {

  transform(token: Word): string {
    if (token.gapStatus) {
      let prompt: string = token.value.substring(0,token.offset);
      return `${prompt}_____`;
    }

    return token.value;
  }

}