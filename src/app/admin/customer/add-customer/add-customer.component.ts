import { Customer } from './../customer.model';
import { CustomerService } from './../customer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  customers: Customer = {};
  formAdd!: FormGroup;



  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private activedRoute: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.formAdd = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]],
      birthday: ['', [Validators.required, Validators.maxLength(50)]],
      image: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      customerType: ['', [Validators.required]],
      citizenIdentifyCart: ['', Validators.required],
      ctime: ['', Validators.required],
      mtime: ['', Validators.required],
      status: ['', Validators.required],
    });


  }

  saveCustomer(customer: Customer) {
    this.customerService.addCustomer(customer).subscribe((res: any) =>
      console.log(res),
    );
    this.router.navigate(['/admin/customer']);
  }

  getInfoCustomer(id: any) {
    const url = 'admin/customer/editCustomer/' + id;
    this.router.navigate([url]);
  }

}
