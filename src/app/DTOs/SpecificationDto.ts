import { ProductSpecificationDto } from './ProductSpecificationDto';

export interface SpecificationDto {
  id: number;
  specificationName: string;
  value?: string;
  productSpecificationDtos: ProductSpecificationDto[];
  ctime?: string;
  mtime?: string;
  status?: number;
}
