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
import { FilterOptionValuePipe } from './products/product-detail/pipes/filter-option-value.pipe';
import { GetLengthArrayPipe } from './products/product-detail/pipes/get-length-array.pipe';
import { QuillModule } from 'ngx-quill';
import { FilterSpecificationPipe } from './products/product-detail/pipes/filter-specification.pipe';
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
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NzGridModule,
    NzSpaceModule,
    QuillModule.forRoot(),
  ],
  exports: [FilterOptionValuePipe, FilterSpecificationPipe, GetLengthArrayPipe],
})
export class AdminModule {}
