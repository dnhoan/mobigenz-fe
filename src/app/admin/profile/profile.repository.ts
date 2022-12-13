import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { CustomerDTO } from '../customer/customer.model';
interface CustomerDrops {
  customer: CustomerDTO | null;
}
export const customerStore = createStore(
  { name: 'customer' },
  withProps<CustomerDrops>({
    customer: null,
  })
);

@Injectable({ providedIn: 'root' })
export class CustomerRepository {}
