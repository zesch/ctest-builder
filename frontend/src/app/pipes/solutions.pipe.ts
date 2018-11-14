import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'solutions',
  pure: false
})
export class SolutionsPipe implements PipeTransform {

  transform(token: Word): string {
    let solution: string = token.value.substring(token.offset);
    let alternatives: string[] = token.alternatives;
    let result = [solution, ...alternatives].join(',');
    return `\{${result}\}`;
  }

}
