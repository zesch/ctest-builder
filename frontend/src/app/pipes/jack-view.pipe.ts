import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'jackView'
})
export class JackViewPipe implements PipeTransform {

  transform(token: Word): string {
    return token.gapStatus ? `${token.value.substring(0, token.offset)}[fillIn groesse="5" parser="none"]` : token.value;
  }

}