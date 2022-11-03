import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerComponent } from './customer/customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { AccountComponent } from './account/account.component';
import { ForgotpasswordComponent } from './account/forgotpassword/forgotpassword.component';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot',
        component: ForgotpasswordComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'customer',
        component: CustomerComponent,
      },
      {
        path: 'account',
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
