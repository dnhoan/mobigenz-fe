import { Pipe, PipeTransform } from '@angular/core';
import { OptionDto } from 'src/app/DTOs/OptionDto';

@Pipe({
  name: 'getLengthArray',
})
export class GetLengthArrayPipe implements PipeTransform {
  transform(options: OptionDto[], id: number): number {
    let length = options.find((option) => option.id == id)?.optionValueDtos
      .length!;
    return length ? length : 0;
  }
}
