import { ProductSpecificationDto } from './ProductSpecificationDto';

export interface SpecificationDto {
  id: number;
  specificationName: string;
  productSpecificationDtos: ProductSpecificationDto[];
  ctime?: string;
  mtime?: string;
  status?: number;
}
