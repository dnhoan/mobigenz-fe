import { SpecificationDto } from './SpecificationDto';

export interface SpecificationGroupDto {
  id: number;
  specificationGroupName: string;
  specificationDtos: SpecificationDto[];
  ctime?: string;
  mtime?: string;
  status?: number;
}
