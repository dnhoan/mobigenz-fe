import { OptionDto } from './OptionDto';
import { OptionValueDto } from './OptionValueDto';

export interface ProductVariantCombinationDto {
  id?: number;
  optionDto?: OptionDto;
  optionValueDto?: OptionValueDto;
}
