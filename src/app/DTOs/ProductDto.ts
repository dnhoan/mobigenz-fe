import { OptionDto } from './OptionDto';
import { ProductSpecificationGroupDto } from './ProductSpecificationGroupDto';
import { ProductVariantOptionDto } from './ProductVariantOptionDto';

export interface ProductDto {
  id: number;
  product_name: string;
  images: string[];
  description: string;
  note: string;
  product_specification_groups: ProductSpecificationGroupDto[];
  product_variant_options: ProductVariantOptionDto[];
  options: OptionDto[];
}
