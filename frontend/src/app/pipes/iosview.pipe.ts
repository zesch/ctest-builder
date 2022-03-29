import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'iosview'
})
export class IosviewPipe implements PipeTransform {

  transform(token: Word): string {
    if (token.gapStatus) {
      let prompt: string = token.value.substring(0,token.offset);
      let solution: string = token.value.substring(token.offset, token.value.length);
      let allSolutions = [solution, ...token.alternatives].join(',');
      return `${prompt}{${allSolutions}}`;
    }

    return token.value;
  }

}