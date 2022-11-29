import { ImeiDto } from './ImeiDto';
import { ProductDetailCartDto } from './ProductDetailCartDto';

export interface OrderDetailDto {
  id?: number;
  priceSell: number;
  productPrice?: number;
  amount: number;
  productDetailCartDto: ProductDetailCartDto;
  imeiDtoList?: ImeiDto[];
  note: string;
  ctime?: string;
  mtime?: string;
  expand?: boolean;
}
