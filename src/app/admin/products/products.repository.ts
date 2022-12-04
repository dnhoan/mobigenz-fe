import { propsArrayFactory, createStore } from '@ngneat/elf';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import {
  selectAllEntities,
  setEntities,
  withEntities,
  selectEntities,
  withUIEntities,
} from '@ngneat/elf-entities';
import { Injectable } from '@angular/core';

export const productsStore = createStore(
  { name: 'products' },
  withEntities<ProductDto>()
);

@Injectable({ providedIn: 'root' })
export class ProductsRepository {
  products$ = productsStore.pipe(selectAllEntities());

  setProducts(products: ProductDto[]) {
    productsStore.update(setEntities(products));
  }
}
