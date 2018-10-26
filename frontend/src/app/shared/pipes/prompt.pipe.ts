import { Pipe, PipeTransform } from '@angular/core';
import { Word } from '../models/word';

@Pipe({
  name: 'prompt',
  pure: false
})
export class PromptPipe implements PipeTransform {
  transform(token: Word): string {
    return token.value.substring(0, token.offset);
  }
}
