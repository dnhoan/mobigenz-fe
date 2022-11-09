import { Pipe, PipeTransform } from '@angular/core';
import { SpecificationDto } from 'src/app/DTOs/SpecificationDto';
import { SpecificationGroupDto } from 'src/app/DTOs/SpecificationGroupDto';

@Pipe({
  name: 'filterSpecification',
})
export class FilterSpecificationPipe implements PipeTransform {
  transform(
    specificationGroupDtos: SpecificationGroupDto[],
    id: number
  ): SpecificationDto[] {
    console.log(specificationGroupDtos, id);

    console.log(
      specificationGroupDtos.find(
        (specificationGroup) => specificationGroup.id == id
      )?.specificationDtos
    );

    return specificationGroupDtos.find(
      (specificationGroup) => specificationGroup.id == id
    )?.specificationDtos as SpecificationDto[];
  }
}
