import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomerService } from './customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomerDTO } from './customer.model';
import { Router } from '@angular/router';
import { SearchDTO } from 'src/app/DTOs/SearchDTO';
import { ToastrService } from 'ngx-toastr';

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
  action = false;
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
  disable = true;
  status!: number;
  constructor(
    private readonly router: Router,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.pagination(this.offset);
    this.initFormSearch();
    this.findByStatus(this.status)
  }

  showModal(action: string): void {
    this.submit = false;
    if (action === 'save') this.action = true;
    if (action === 'update') this.action = false;
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
      citizenIdentifyCart: ['', [Validators.pattern('^[0-9]{12}$')]],
    });
    this.isVisible = true;
  }

  findByStatus(status: any) {
    if (status == '' || status == null) {
      this.pagination(this.offset);
    } else {
      this.customerService
        .getByStatus(this.offset, this.limit, status)
        .subscribe((res) => {
          this.datas = res.data.customer.content;
        });
    }
  }

  handleOk(): void {
    this.submit = true;
    if (this.formCus.valid) {
      this.saveCustomer();
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
    return;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.getAllCustomer();
  }

  getAllCustomer() {
    this.customerService
      .getAll(this.offset, this.limit)
      .subscribe((res: any) => {
        this.datas = res.data.customers.items;
      });
  }

  getInfoCustomer(id: any) {
    this.showModal('update');
    const customerByID = this.datas.find((value) => {
      return value.id == id;
    });
    if (customerByID) {
      this.customer = customerByID;
    }
    this.fillValueForm();
    this.formCus.get('email')?.disable();
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
      citizenIdentifyCart: '',
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
          this.isVisible = false;
          return;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
    return;
  }

  addValueCustomer() {
    // let bd;
    // if (this.customer.birthday) bd = this.reFormatDate(this.customer.birthday);
    // else bd = null;
    this.customer.id = this.formCus.value.id;
    this.customer.customerName = this.formCus.value.customerName;
    this.customer.phoneNumber = this.formCus.value.phoneNumber;
    this.customer.birthday = this.formCus.value.birthday;
    this.customer.gender = this.formCus.value.gender;
    this.customer.email = this.formCus.value.email;
    this.customer.citizenIdentifyCart = this.formCus.value.citizenIdentifyCart;
    this.customer.ctime = this.formCus.value.ctime;
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

  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  reFormatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
