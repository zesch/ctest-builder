import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'plainSolutions'
})
export class PlainSolutionsPipe implements PipeTransform {

  transform(token: Word): string {
    const elem: HTMLElement = new HTMLElement();
    elem.innerHTML = '{{token.substring(0, token.offset)}}<span style="color: red">{{token.substring(token.offset)}}</span>'
    return elem.innerHTML;
  }

}
