import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'solution',
  pure: false
})
export class SolutionPipe implements PipeTransform {

  transform(token: Word): string {
    return '\{' + token.value.substring(token.offset, token.value.length) + '\}';
  }

}