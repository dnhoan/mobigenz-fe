import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from './customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomerDTO } from './customer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  formCus!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  customer: Customer = {};
  datas: Customer[] = [];
  offset = 0;
  limit = 3;
  Page: any;
  customerSearch: CustomerDTO = {};
  customerDTO: CustomerDTO = {};
  sortBy = 'customerName';
  descAsc = 'desc';
  idCustomer: any;
  indexPage = 0;
  isVisible = false;
  constructor(
    private readonly router: Router,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pagination(this.offset)
    this.initFormSearch();
  }

  // submitForm(): void {
  //   console.log('submit', this.formCus.value);
  // }

  showModal(): void {
    if (this.customer && this.customer.id != 0) {
      this.customer.id = 0;
    }

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
      ctime: [''],
      status: [1, Validators.required],
    });
    this.isVisible = true;
  }

  // showModalUpdate(id: any): void {
  //   this.fillValueForm()
  //   this.isVisible = true;
  // }

  handleOk(): void {
    console.log(this.customer);
    this.addValueCustomer();
    this.saveCustomer(this.customer);
    this.isVisible = false;
  }

  saveCustomer(customer: Customer) {
    this.customerService
      .addCustomer(customer)
      .subscribe((res: any) => this.getAllCustomer());
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllCustomer() {
    this.customerService.getAll(this.offset, this.limit).subscribe((res: any) => {
      this.datas = res.data.customers.items;
    });
  }

  getInfoCustomer(id: any) {
    this.showModal();
    const customerByID = this.datas.find((value) => {
      return value.id == id;
    });
    if (customerByID) {
      this.customer = customerByID;
    }
    this.fillValueForm();
  }

  initForm() {
    this.initFormCus();
    this.initFormSearch();
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

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: '',
    });
  }

  fillValueForm() {
    this.formCus.patchValue({
      id: this.customer.id,
      customerName: this.customer.customerName,
      phoneNumber: this.customer.phoneNumber,
      birthday: this.customer.birthday,
      gender: this.customer.gender,
      email: this.customer.email,
      customerType: this.customer.customerType,
      citizenIdentifyCart: this.customer.citizenIdentifyCart,
      ctime: this.customer.ctime,
      status: this.customer.status,
    });
  }

  update() {
    this.addValueCustomer();
    console.log(this.addValueCustomer());
    console.log(this.customer);
    this.customerService.updateCustomer(this.customer).subscribe((res) => {
      alert('Cập nhật thành công');
      this.router.navigate(['/admin/customer']).then((r) => console.log(r));
    });
  }

  addValueCustomer() {
    console.log(this.formCus.value);
    this.customer.customerName = this.formCus.value.customerName;
    this.customer.phoneNumber = this.formCus.value.phoneNumber;
    this.customer.birthday = this.formCus.value.birthday;
    this.customer.gender = this.formCus.value.gender;
    this.customer.email = this.formCus.value.email;
    this.customer.customerType = this.formCus.value.customerType;
    this.customer.citizenIdentifyCart = this.formCus.value.citizenIdentifyCart;
    this.customer.ctime = this.formCus.value.ctime;
    this.customer.status = this.formCus.value.status;
  }

  deleteCustomer(id: any) {
    this.customerService.deleteCustomer(id).subscribe((res: any) =>
      this.datas.forEach((value) => {
        if (value.id == id) {
          value.status = 0;
        }
      })
    );
  }


  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page
    this.customerService.getAll(this.offset, this.limit)
      .subscribe(res => {
        this.datas = res.data.customers.items;
        console.log(this.datas);

        this.Page = res.data.customers;
      },)

  }

  pageItem(pageItems: any){
    this.limit =  pageItems;
    this.pagination(this.offset);
  }


  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }
}
