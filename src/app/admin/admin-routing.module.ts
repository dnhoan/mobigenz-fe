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
import { ExchangeOrderDetailComponent } from './exchange-order/exchange-order-detail/exchange-order-detail.component';
import { ExchangeOrderComponent } from './exchange-order/exchange-order.component';
import { IncomeComponent } from './statistical/income/income.component';
import { OrderStatusComponent } from './statistical/order-status/order-status.component';
import { AuthGuard } from '../guards/auth.guard';
import { EmployeeComponent } from './employee/employee.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        canActivate: [AuthGuard],
        component: ProductsComponent,
      },
      {
        path: 'customer',
        canActivate: [AuthGuard],
        component: CustomerComponent,
      },
      {
        path: 'employee',
        canActivate: [AdminGuard],
        component: EmployeeComponent,
      },
      {
        path: 'account',
        canActivate: [AdminGuard],
        component: AccountComponent,
      },
      {
        path: 'createOrder',
        canActivate: [AuthGuard],
        component: CreateOrderComponent,
      },
      {
        path: 'order/:id',
        canActivate: [AuthGuard],
        component: CreateOrderComponent,
      },
      {
        path: 'exchangeOrder/:id',
        canActivate: [AuthGuard],
        component: ExchangeOrderDetailComponent,
      },
      {
        path: 'exchangeOrders',
        canActivate: [AuthGuard],
        component: ExchangeOrderComponent,
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        component: OrdersComponent,
      },
      {
        path: 'statistic/income',
        canActivate: [AdminGuard],
        component: IncomeComponent,
      },
      {
        path: 'statistic/orders',
        canActivate: [AdminGuard],
        component: OrderStatusComponent,
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
