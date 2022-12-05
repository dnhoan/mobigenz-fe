import { OptionValueDto } from './../../../DTOs/OptionValueDto';
import { CustomerService } from './../customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss']
})
export class UpdateCustomerComponent implements OnInit {
  formEdit!: FormGroup;
  customer!: Customer;
  id?: any;


  constructor(private fb: FormBuilder,
    private readonly router: Router,
    private activedRoute: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.formEdit = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]],
      birthday: ['', [Validators.required, Validators.maxLength(50)]],
      image: ['', [Validators.required, Validators.email]],
      gender: [0, [Validators.required]],
      customerType: ['', [Validators.required]],
      citizenIdentifyCart: ['', Validators.required],
      ctime: ['', Validators.required],
      mtime: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.activedRoute.paramMap.subscribe(
      params => {
        const idCustomer = params.get('id');
        this.id = idCustomer;
        console.log(idCustomer);

        if (idCustomer) {
          this.customerService.getCustomerById(idCustomer).subscribe(
            res => {
              this.customer = res.data.customer;
              this.fillValueForm();
            },
          );
        }
      },
    );
  }

  initForm() {
    this.formEdit = this.fb.group({
      customerName: '',
      phoneNumber: '',
      birthday: '',
      gender: '',
      email: '',
      customerType: '',
      citizenIdentifyCart: '',
      ctime: '',
      mtime: '',
      status: ''
    });
  }
  fillValueForm() {
    this.formEdit.patchValue({
      customerName: this.customer?.customerName,
      phoneNumber: this.customer?.phoneNumber,
      birthday: this.customer?.birthday,
      gender: this.customer?.gender,
      email: this.customer?.account?.email,
      customerType: this.customer?.customerType,
      citizenIdentifyCart: this.customer?.citizenIdentifyCart,
      ctime: this.customer?.ctime,
      mtime: this.customer?.mtime,
      status: this.customer?.status,
    });
  }

  update() {
    this.addValueCustomer();
    console.log(this.addValueCustomer());
    console.log(this.customer);
    this.customerService.updateCustomer(this.customer).subscribe(
      res => {
        alert("Cập nhật thành công")
        this.router.navigate(['/admin/customer']).then(r => console.log(r));
      });
  }


  addValueCustomer() {
    this.customer.customerName = this.formEdit.value.customerName;
    this.customer.phoneNumber = this.formEdit.value.phoneNumber;
    this.customer.birthday = this.formEdit.value.birthday;
    this.customer.gender = this.formEdit.value.gender;
    this.customer.email = this.formEdit.value.email;
    this.customer.customerType = this.formEdit.value.customerType;
    this.customer.citizenIdentifyCart = this.formEdit.value.citizenIdentifyCart;
    this.customer.ctime = this.formEdit.value.ctime;
    this.customer.mtime = this.formEdit.value.mtime;
    this.customer.status = this.formEdit.value.status;

  }

}
