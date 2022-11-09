import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../admin/account/account.model';
import { AccountService } from '../admin/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formRegister!: FormGroup;
  formLogin!: FormGroup;
  formForgot!: FormGroup;
  account: Account = {};
  isVisible = false;
  isChangePassWord = false
  isRegister = false;
  radioValue = 'A';
  isSubmitted = false;
  isLoggedIn = false;
  isforgot = false;

  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.formLogin.valid) {
      console.log('submit', this.formLogin.value);
    } else {
      Object.values(this.formLogin.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }

  showModal(): void {
    this.formRegister! = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required]],
      phoneNumber: [''],
    });
    this.isVisible = true;
  }

  showModalForgot(): void {
    this.formForgot! = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      otp: ['', [Validators.required]],
    });
    this.isforgot = true;
  }

  registerAccount() {
    this.addValueAccount();
    this.accountService.register(this.account).subscribe(
      (res) => {
        this.toastr.success('Đăng ký tài khoản thành công!');
      },
      (error) => {
        if (error.error.message === 'Email này đã tồn tại') {
          this.toastr.error(error.error.message);
        } else if (error.error.message === 'Không được để trống') {
          this.toastr.error(error.error.message);
        }
      }
    );
  }

  handleOk(): void {
    console.log(this.formRegister.value);
    this.registerAccount();
    this.isVisible = false;
    this.isRegister = false;
    this.isforgot = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isRegister = false;
    this.isforgot = false;
  }

  onSubmit() {}

  login() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.accountService
        .login(this.formLogin.value.email, this.formLogin.value.password)
        .subscribe((data) => {
          console.log(
            this.formLogin.value.email,
            this.formLogin.value.password
          );

          this.isLoggedIn = true;
          // this.roles = this.tokenService.getUser().roles;
          this.router.navigate(['/admin']);
        });
    }
  }

  addValueAccount() {
    this.account.email = this.formRegister.value.email;
    this.account.password = this.formRegister.value.email;
    this.account.phoneNumber = this.formRegister.value.phoneNumber;
    // this.account.roleid = { id: this.formRegister.value.role };
    // if (this.formRegister.value.status == 1) {
    //   this.account.status = 1;
    // } else {
    //   this.account.status = 0;
    // }
  }

  public sendOtp() {
    this.accountService.sendOTP(this.formForgot.value.email).subscribe(
      (res) => {




































































































































































































































































































































































































                                                                                                                                                                                                                                                                                                      

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }
}
