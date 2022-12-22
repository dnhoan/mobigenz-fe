import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { CustomerDTO } from '../customer/customer.model';
import { EmployeeDTO } from '../employee/employee.model';
interface EmployeeDrops {
  employee: EmployeeDTO | null;
}
export const profileStore = createStore(
  { name: 'info' },
  withProps<EmployeeDrops>({
    employee: null,
  })
);

@Injectable({ providedIn: 'root' })
export class CustomerRepository {}
