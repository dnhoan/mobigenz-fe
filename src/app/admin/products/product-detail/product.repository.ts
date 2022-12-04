import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { ORDER_STATUS } from 'src/app/constants';
import { ProductDto } from 'src/app/DTOs/ProductDto';

export const productInit: ProductDto = {
  id: '',
  productName: '',
  description: '',
  images: [],
  detail: '',
  manufacturerDto: {
    id: undefined,
    productLineDtos: [],
    manufacturerName: '',
  },
  productLineDto: { id: undefined, productLineName: '' },
  productDetailDtos: [],
  optionDtos: [],
  specificationGroupDtos: [],
  note: '',
};
export const productStore = createStore(
  { name: 'product' },
  withProps<ProductDto>(productInit)
);

@Injectable({ providedIn: 'root' })
export class ProductRepository {}
