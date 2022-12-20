import { Pipe, PipeTransform } from '@angular/core';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';

@Pipe({
  name: 'filterOptionValue',
})
export class FilterOptionValuePipe implements PipeTransform {
  // transform(
  //   options: OptionDto[],
  //   id: number,
  //   optionValueSelected: OptionValueDto[]
  // ): OptionValueDto[] {
  //   let optionValues = options.find((option) => option.id == id)
  //     ?.optionValueDtos as OptionValueDto[];
  //   optionValues = optionValues.map((op) => {
  //     let isDisable = false;
  //     if (optionValueSelected.some((optionValue) => optionValue.id == op.id)) {
  //       isDisable = true;
  //     }
  //     return { ...op, isDisable };
  //   });
  //   return optionValues ? optionValues : [];
  // }
  transform(options: OptionDto[], id: number): OptionValueDto[] {
    let optionValues = options.find((option) => option.id == id)
      ?.optionValueDtos as OptionValueDto[];
    return optionValues ? optionValues : [];
  }
}
