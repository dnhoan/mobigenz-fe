import { OptionValueDto } from './OptionValueDto';

export interface OptionDto {
  id: number;
  optionName: string;
  optionValueDtos: OptionValueDto[];
  note?: string;
  ctime?: string;
  mtime?: string;
  status?: number;
}
