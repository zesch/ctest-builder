import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'coloredGaps'
})
export class ColoredGapsPipe implements PipeTransform {

  transform(token: Word, showAlternatives: boolean = true, separator: string = '/-'): string {
    let solution = token.value.substring(token.offset, token.value.length);
    if(!showAlternatives)
      return solution;

    let solutions = [solution, ...token.alternatives];
    return solutions.join(separator);
  }

}
