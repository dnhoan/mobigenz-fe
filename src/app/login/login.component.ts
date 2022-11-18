import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
  closeResult = '';
  validateForm!: UntypedFormGroup;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    private modalService: NgbModal,
    private authService: AuthService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private infoUser: InfoService
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenService.getUser().roles;
    }
    this.initForm();
  }


	open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}


  initForm() {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false, [Validators.required]],
    });
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required]],
      phoneNumber: [''],
    });

    this.formForgot! = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      otp: ['', [Validators.required]],
    });
    this.isforgot = true;
  }


  // submitForm(): void {
  //   if (this.formLogin.valid) {
  //     console.log('submit', this.formLogin.value);
  //   } else {
  //     Object.values(this.formLogin.controls).forEach((control) => {
  //       if (control.invalid) {
  //         control.markAsDirty();
  //         control.updateValueAndValidity({ onlySelf: true });
  //       }
  //     });
  //   }
  // }


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

  // handleOk(): void {
  //   console.log(this.formRegister.value);
  //   this.registerAccount();
  //   this.isVisible = false;
  //   this.isRegister = false;
  //   this.isforgot = false;
  // }

  // handleCancel(): void {
  //   this.isVisible = false;
  //   this.isRegister = false;
  //   this.isforgot = false;
  // }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe((data) => {
        this.isLoggedIn = true;
        this.tokenService.saveToken(data.token);
        const jwtDecode = this.accountService.getDecodedAccessToken();
        this.tokenService.saveAccount(jwtDecode.sub);
        const role = jwtDecode.auth.split(',');
        console.log(role);
        // this.saveAccount();
        const email = this.sessionService.getItem('auth-user');
        this.accountService.getAccountByEmail(email).subscribe((res) => {
          localStorage.setItem('id-account', res.data.account.id);
          // this.getByUserName();
          this.infoUser.getUser();
        });
        if (localStorage.getItem('auth-token') != null && (role.includes('Admin'))) {
          this.router.navigate(['/admin']);
          this.toastr.success("Đăng nhập thành công!")
        }
        if(localStorage.getItem('auth-token') != null && (role.includes('User'))){
          this.router.navigate(['/login']);
          this.toastr.error("Bạn không có quyền đăng nhập vào trang này!")
        }

        // if (localStorage.getItem('auth-token') && (role.includes('User'))) {

        // }

      });
    }
    if (localStorage.getItem('auth-token') == null) {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
      this.toastr.error("Tài khoản hoặc mật khẩu không chính xác!")
      return;
    }
  }

  login() {
    this.isSubmitted = true;
    if (this.formLogin.value) {
      this.loginService.login(this.formLogin.value).subscribe((data) => {
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
    this.account.password = this.formRegister.value.password;
    this.account.phoneNumber = this.formRegister.value.phoneNumber;
    // this.account.roleid = { id: this.formRegister.value.role };
    // if (this.formRegister.value.status == 1) {
    //   this.account.status = 1;
    // } else {
    //   this.account.status = 0;
    // }
  }

  // saveUser() {
  //   const username = this.sessionService.getItem('auth-user');
  //   console.log(username);
  //   this.profileService.getProfileByUserName(username).subscribe(
  //     (res) => {
  //       console.log(res);
  //       localStorage.setItem('id-user', res.id);
  //     });
  // }

}
