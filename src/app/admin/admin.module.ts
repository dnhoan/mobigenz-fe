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
import { AccountComponent } from './account/account.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';


@NgModule({
  declarations: [AdminComponent, ProductsComponent, CustomerComponent, AccountComponent, AddCustomerComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, ReactiveFormsModule, NzGridModule, NzSpaceModule ],
})
export class AdminModule { }
