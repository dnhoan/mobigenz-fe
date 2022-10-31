import { ManufacturerDto } from './ManufacturerDto';
import { OptionDto } from './OptionDto';
import { ProductDetailDto } from './ProductDetailDto';
import { ProductLineDto } from './ProductLineDto';
import { ProductSpecificationGroupDto } from './ProductSpecificationGroupDto';
import { ProductVariantOptionDto } from './ProductVariantOptionDto';
import { SpecificationGroupDto } from './SpecificationGroupDto';

export interface ProductDto {
  id: number | string;
  productName: string;
  description: string;
  image?: string;
  images: string[];
  manufacturerDto?: ManufacturerDto;
  productLineDto?: ProductLineDto;
  productDetailDtos: ProductDetailDto[];
  optionDtos?: OptionDto[];
  specificationGroupDtos?: SpecificationGroupDto[];
  note?: string;
  ctime?: string;
  mtime?: string;
  status?: number;
}
