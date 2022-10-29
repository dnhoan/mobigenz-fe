import { CustomerService } from './customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomerDTO } from './customer.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customer!: Customer;
  datas: Customer[] = [];
  page: object = {};
  customerSearch: CustomerDTO = {};
  customerDTO: CustomerDTO = {};
  sortBy = 'customerName';
  descAsc = 'desc';
  idCustomer: any;
  indexPage = 0;
  constructor(
    private readonly router: Router,
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

  getInfoCustomer(id: any) {
    const url = 'admin/customer/editCustomer/' + id;
    this.router.navigate([url]);
  }

  deleteCustomer(id: any) {
    this.delete(id);
    this.customerService.deleteCustomer(id).subscribe((res: any) =>
      console.log(res)
    );
  }

  delete(id: any) {
    this.datas = this.datas.filter(item => item.id !== id);
    this.getAllCustomer();
  }


  pagination(page: any) {
    if (page < 0) {
      page = 0;
    }
    this.indexPage = page;
    this.customerService.getPageTransfer(this.indexPage,
      this.sortBy, this.descAsc)
      .subscribe(res => {
        this.datas = res.object.content;
        this.page = res.object;
        console.log(this.page);
      });
  }

}
