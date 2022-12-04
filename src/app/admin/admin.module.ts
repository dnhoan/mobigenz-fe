import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerComponent } from './customer/customer.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { AccountComponent } from './account/account.component';
import { FilterOptionValuePipe } from './pipes/filter-option-value.pipe';
import { GetLengthArrayPipe } from './pipes/get-length-array.pipe';
import { QuillModule } from 'ngx-quill';
import { FilterSpecificationPipe } from './pipes/filter-specification.pipe';
import { ImeiComponent } from './products/imei/imei.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderStatusPipe } from './pipes/order-status.pipe';
import { SelectImeiComponent } from './create-order/select-imei/select-imei.component';
import { DeliveryInfoComponent } from './create-order/delivery-info/delivery-info.component';
import { CustomerInfoComponent } from './create-order/customer-info/customer-info.component';
import { AddressComponent } from './create-order/address/address.component';
import { ChartModule } from 'primeng/chart';
import { IncomeComponent } from './statistical/income/income.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { ExchangeOrderComponent } from './exchange-order/exchange-order.component';
import { ExchangeOrderDetailComponent } from './exchange-order/exchange-order-detail/exchange-order-detail.component';
import { ExchangeProductComponent } from './exchange-order/exchange-order-detail/exchange-product/exchange-product.component';
import { OrderStatusComponent } from './statistical/order-status/order-status.component';
import { ProductVariantsComponent } from './products/product-detail/product-variants/product-variants.component';
@NgModule({
  declarations: [
    AdminComponent,
    ProductsComponent,
    ProductDetailComponent,
    CustomerComponent,
    AccountComponent,
    AddCustomerComponent,
    UpdateCustomerComponent,
    FilterOptionValuePipe,
    FilterSpecificationPipe,
    GetLengthArrayPipe,
    ImeiComponent,
    OrderStatusPipe,
    OrdersComponent,
    CreateOrderComponent,
    SelectImeiComponent,
    DeliveryInfoComponent,
    CustomerInfoComponent,
    AddressComponent,
    IncomeComponent,
    OrderDetailComponent,
    ExchangeOrderComponent,
    ExchangeOrderDetailComponent,
    ExchangeProductComponent,
    OrderStatusComponent,
    ProductVariantsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ChartModule,
    ReactiveFormsModule,
    NzGridModule,
    NzSpaceModule,
    QuillModule.forRoot(),
  ],
  exports: [FilterOptionValuePipe, FilterSpecificationPipe, GetLengthArrayPipe],
})
export class AdminModule {}
