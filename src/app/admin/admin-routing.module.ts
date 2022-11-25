import { CustomerComponent } from './customer/customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from '../login/login.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        canActivate: [AdminGuard],
        component: ProductsComponent,
      },
      {
        path: 'customer',
        canActivate: [AdminGuard],
        component: CustomerComponent,
      },
      {
        path: 'account',
        canActivate: [AdminGuard],
        component: AccountComponent,
      },
      // {
      //   path: 'customer/addCustomer',
      //   component: AddCustomerComponent,
      // },
      // {
      //   path: 'customer/editCustomer/:id',
      //   component: UpdateCuCustomerComponent,
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
