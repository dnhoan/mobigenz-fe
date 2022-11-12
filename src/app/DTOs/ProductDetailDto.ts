import { ImeiDto } from './ImeiDto';
import { ProductVariantCombinationDto } from './ProductVariantCombinationDto';

export interface ProductDetailDto {
  id?: number;
  price?: number;
  priceOrigin: number;
  priceSell: number;
  stock: number;
  imeis?: ImeiDto[];
  sku: string;
  image: string;
  productVariantCombinationDtos?: ProductVariantCombinationDto[];
}
