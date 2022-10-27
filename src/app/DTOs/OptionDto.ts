import { OptionValueDto } from './OptionValueDto';

export interface OptionDto {
  id: number;
  option_name: string;
  option_values: OptionValueDto[];
  note?: string;
  ctime?: string;
  mtime?: string;
  status?: number;
}
