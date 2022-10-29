import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerComponent } from './customer/customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'customer',
        component: CustomerComponent,
      },
      {
        path: 'customer/addCustomer',
        component: AddCustomerComponent,
      },
      {
        path: 'customer/editCustomer/:id',
        component: UpdateCustomerComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
