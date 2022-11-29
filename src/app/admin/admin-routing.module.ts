import { CustomerComponent } from './customer/customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from '../login/login.component';
import { AdminGuard } from '../guards/admin.guard';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrdersComponent } from './orders/orders.component';
import { StatisticalComponent } from './statistical/statistical.component';
import { IncomeComponent } from './statistical/income/income.component';

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
      {
        path: 'createOrder',
        component: CreateOrderComponent,
      },
      {
        path: 'order/:id',
        component: CreateOrderComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'statis/income',
        component: IncomeComponent,
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
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
