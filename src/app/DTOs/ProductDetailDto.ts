import { ProductVariantCombinationDto } from './ProductVariantCombinationDto';

export interface ProductDetailDto {
  id?: number;
  price?: number;
  priceOrigin: number;
  priceSell: number;
  sku: string;
  image: string;
  productVariantCombinationDtos?: ProductVariantCombinationDto[];
}
