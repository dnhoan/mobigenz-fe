import { CustomerService } from './customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer } from './customer.model';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  datas: Customer[] = [];
  constructor(
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.getAllCustomer();
  }

  getAllCustomer() {
    this.customerService.getAll().subscribe((res: any) => {
      console.log(res.data.customers.items);
      this.datas = res.data.customers.items;
    });
  }



}
