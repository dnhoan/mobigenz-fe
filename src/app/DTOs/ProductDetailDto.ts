import { ProductVariantCombinationDto } from './ProductVariantCombinationDto';

export interface ProductDetailDto {
  id: number;
  price: number;
  sku: string;
  stock: number;
  image: string;
  productVariantCombinationDtos: ProductVariantCombinationDto[];
}
