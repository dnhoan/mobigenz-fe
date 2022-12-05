import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from './customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomerDTO } from './customer.model';
import { Router } from '@angular/router';
import { SearchDTO } from 'src/app/DTOs/SearchDTO';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

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
  limit = 5;
  Page: any;
  customerSearch: CustomerDTO = {};
  customerDTO: CustomerDTO = {};
  searchDTO: SearchDTO = {};
  idCustomer: any;
  indexPage = 0;
  isVisible = false;
  submit = false;
  constructor(
    private readonly router: Router,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.pagination(this.offset);
    this.initFormSearch();
  }

  // submitForm(): void {
  //   console.log('submit', this.formCus.value);
  // }

  showModal(): void {
    this.submit = false;
    this.formCus = this.fb.group({
      id: null,
      customerName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      birthday: ['', [Validators.required]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      customerType: [''],
      citizenIdentifyCart: [''],
      ctime: ['', [Validators.required]],
      status: [1],
    });
    this.isVisible = true;
  }

  handleOk(): void {
    this.submit = true;
    if (this.formCus.valid) {
      this.saveCustomer();
      this.isVisible = false;
    }
  }

  saveCustomer() {
    if (this.customer.id) {
      this.update();

      return;
    }
    this.addCustomer(this.customer);
  }

  addCustomer(customer: Customer) {
    if (this.formCus.valid) {
      this.addValueCustomer();
      this.customerService.addCustomer(customer).subscribe(
        (res) => {
          this.getAllCustomer();
          this.toastr.success('Thêm khách hàng thành công!');
          this.isVisible = false;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
    this.isVisible = true;
    return;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllCustomer() {
    this.customerService
      .getAll(this.offset, this.limit)
      .subscribe((res: any) => {
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
    if (this.formCus.valid) {
      this.addValueCustomer();
      this.customerService.updateCustomer(this.customer).subscribe(
        (res) => {
          this.getAllCustomer();
          this.toastr.success('Cập nhật khách hàng thành công!');
          return;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
    this.isVisible = true;
    return;
  }

  addValueCustomer() {
    this.customer.id = this.formCus.value.id;
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
    this.customerService.deleteCustomer(id).subscribe(
      (res) => {
        this.datas.forEach((value) => {
          if (value.id == id) {
            value.status = 0;
            this.toastr.success('Xóa thành công!');
            return;
          }
        });
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.customerService.getAll(this.offset, this.limit).subscribe((res) => {
      this.datas = res.data.customers.items;
      console.log(this.datas);

      this.Page = res.data.customers;
    });
  }

  changePage(page: number) {}

  pageItem(pageItems: any) {
    this.limit = pageItems;
    this.pagination(this.offset);
  }

  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset;
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.customerService
      .getPageCustomer(this.offset, this.limit, this.searchDTO)
      .subscribe((res) => {
        this.datas = res.data.customers.content;
        this.Page = res.data.customers;
      });
  }
  FillValueSearch() {
    const formSearchValue = this.formSearch.value;
    this.searchDTO.valueSearch = formSearchValue.valueSearch;
  }

  timkiem() {
    this.FillValueSearch();
    this.searchWithPage(0);
    this.initFormSearch();
  }
}
