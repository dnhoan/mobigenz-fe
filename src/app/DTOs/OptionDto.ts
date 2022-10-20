import { OptionValueDto } from './OptionValueDto';

export interface OptionDto {
  option_name: string;
  note: string;
  status: number;
  option_values: OptionValueDto[];
}
