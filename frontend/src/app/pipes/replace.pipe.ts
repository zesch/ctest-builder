import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, count?: any, isAllowed?: any,lastPart?:boolean): any {
    if (lastPart){
      return isAllowed?value: value.slice(count);
    }
    return isAllowed ? value : value.slice(0, count) + (value.slice(count).replace(/./g, '_'));
  }

}