import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../admin/account/account.model';
import { AccountService } from '../admin/account/account.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './login.service';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';
import { SessionService } from '../service/session.service';
import { InfoService } from '../service/infoUser.service';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgbModal],
})
export class LoginComponent implements OnInit {
  formRegister!: FormGroup;
  formLogin!: FormGroup;
  formForgot!: FormGroup;
  account: Account = {};
  isVisible = false;
  isChangePassWord = false;
  isRegister = false;
  radioValue = 'A';
  isSubmitted = false;
  isLoggedIn = false;
  isforgot = false;
  validateForm!: UntypedFormGroup;
  modalService: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private infoUser: InfoService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
    }
    this.initForm();
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['levantrang4302@gmail.com', [Validators.required]],
      password: ['Admin@123', [Validators.required]],
      remember: [false, [Validators.required]],
    });
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required]],
      repassword: ['', [Validators.required]],
      phoneNumber: ['',[Validators.required]],
    });

    this.formForgot! = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      otp: ['', [Validators.required]],
    });
    this.isforgot = true;
  }

  showModal(): void {
    this.initForm();
    this.isVisible = true;
  }

  initRegis(){
    this.formRegister.value.email = '';
    this.formRegister.value.password = '';
    this.formRegister.value.repassword = '';
    this.formRegister.value.phoneNumber = '';
  }

  handleOk(): void {
    this.registerAccount();
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  registerAccount() {
    if(!this.formRegister.valid){
      this.toastr.error("Bạn phải nhập đầy đủ thông tin!")
      return;
    }
    if(this.formRegister.value.password != this.formRegister.value.repassword){
      this.toastr.error("Mật khẩu xác nhận phải trùng khớp!")
      return;
    }else{
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

  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe(
        (data) => {
          this.isLoggedIn = true;
          this.tokenService.saveToken(data.token);
          const jwtDecode = this.accountService.getDecodedAccessToken();
          this.tokenService.saveAccount(jwtDecode.sub);
          const role = jwtDecode.auth.split(',');
          this.infoUser.getUser();
          if (
            localStorage.getItem('auth-token') != null &&
            role.includes("Admin")
          ) {
            this.router.navigate(['/admin']);
            this.toastr.success('Đăng nhập thành công!');
          }
          if (
            localStorage.getItem('auth-token') != null &&
            role.includes("User")
          ) {
            this.router.navigate(['/login']);
            this.toastr.error('Bạn không có quyền đăng nhập vào trang này!');
          }
        },
        (error) => {
          this.router.navigate(['/login']);
          this.toastr.error('Tài khoản hoặc mật khẩu không chính xác!');
        }
      );
    }
  }

  addValueAccount() {
    this.account.email = this.formRegister.value.email;
    this.account.password = this.formRegister.value.password;
    this.account.phoneNumber = this.formRegister.value.phoneNumber;
  }
}
