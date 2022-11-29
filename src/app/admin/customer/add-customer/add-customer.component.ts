import { Customer } from './../customer.model';
import { CustomerService } from './../customer.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ORDER_STATUS } from 'src/app/constants';
import { orderStore } from '../../create-order/order.repository';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  customer!: Customer;
  formCus!: FormGroup;
  isShowModalAddCustomer = false;
  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private activedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.formCus = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      birthday: ['', [Validators.required, Validators.maxLength(50)]],
      gender: [1, [Validators.required]],
      email: ['', Validators.required],
      customerType: [1, Validators.required],
      citizenIdentifyCart: ['', Validators.required],
      status: [1, Validators.required],
    });
  }
  showModalAddCustomer() {
    this.isShowModalAddCustomer = true;
  }
  handleOk(): void {
    this.customer = {
      ...this.formCus.value,
    };
    this.customerService.addCustomer(this.customer).subscribe((res: any) => {
      if (res) {
        console.log(res);
        orderStore.update((state) => ({
          orderDto: { ...state.orderDto, customerDTO: res.data.customers },
        }));
        this.isShowModalAddCustomer = false;
      }
    });
  }
  handleCancel(): void {
    this.isShowModalAddCustomer = false;
  }
  initFormCus() {
    this.formCus = this.fb.group({
      customerName: '',
      phoneNumber: '',
      birthday: '',
      gender: '',
      email: '',
      customerType: '',
      citizenIdentifyCart: '',
      status: '',
    });
  }
  addValueCustomer() {
    // this.customer.customerName = this.formCus.value.customerName;
    // this.customer.phoneNumber = this.formCus.value.phoneNumber;
    // this.customer.birthday = this.formCus.value.birthday;
    // this.customer.gender = this.formCus.value.gender;
    // this.customer.email = this.formCus.value.email;
    // this.customer.customerType = this.formCus.value.customerType;
    // this.customer.citizenIdentifyCart = this.formCus.value.citizenIdentifyCart;
    // this.customer.ctime = this.formCus.value.ctime;
    // this.customer.status = this.formCus.value.status;
  }
  // saveCustomer(customer: Customer) {
  //   this.customerService.addCustomer(customer).subscribe((res: any) =>
  //     console.log(res),
  //   );
  //   this.customerService.getAll();
  //   this.router.navigate(['/admin/customer']);
  // }

  // getInfoCustomer(id: any) {
  //   const url = 'admin/customer/editCustomer/' + id;
  //   this.router.navigate([url]);
  // }
}
