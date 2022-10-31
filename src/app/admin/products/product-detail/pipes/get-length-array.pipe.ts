import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getLengthArray',
})
export class GetLengthArrayPipe implements PipeTransform {
  transform(array: any[]): number {
    if (array) {
      return array.length;
    }
    return 0;
  }
}
