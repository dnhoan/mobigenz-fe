import { Pipe, PipeTransform } from '@angular/core';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';

@Pipe({
  name: 'filterOptionValue',
})
export class FilterOptionValuePipe implements PipeTransform {
  transform(options: OptionDto[], id: number): OptionValueDto[] {
    return options.find((option) => option.id == id)
      ?.optionValueDtos as OptionValueDto[];
  }
}
