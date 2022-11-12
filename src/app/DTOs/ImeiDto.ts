import { ProductDetailDto } from './ProductDetailDto';

export interface ImeiDto {
  id: number;
  imei: string;
  status: 1;
  productDetailDto?: ProductDetailDto;
}
