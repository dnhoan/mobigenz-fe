import { Component, Inject } from '@angular/core';
import { FirebaseStorage } from 'firebase/storage';
import { finalize, Observable } from 'rxjs';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { InfoService } from './service/infoUser.service';
import { Route, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // title = 'mobigenz-fe';
  // selectedFile!: File;
  // fb!: string;
  // downloadURL!: Observable<string>;
  constructor(private storage: AngularFireStorage,
    private infoService: InfoService,
    private router: Router,
    private toast: ToastrService) {}
  isCollapsed = false;
  // onFileSelected(event: any) {
  //   console.log(event);

  //   var n = Date.now();
  //   const file = event.target.files[0];
  //   const filePath = `product_images/${n}`;
  //   const fileRef = this.storage.ref(filePath);
  //   console.log(file);
  //   console.log(fileRef);

  //   const task = this.storage.upload(`product_images/${n}`, file);
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         this.downloadURL = fileRef.getDownloadURL();
  //         this.downloadURL.subscribe((url: any) => {
  //           if (url) {
  //             this.fb = url;
  //           }
  //           console.log(this.fb);
  //         });
  //       })
  //     )
  //     .subscribe((url: any) => {
  //       if (url) {
  //         console.log(url);
  //       }
  //     });
  // }

  public logout() {
    window.localStorage.removeItem('auth-token');
    window.localStorage.removeItem('auth-user');
    window.localStorage.removeItem('id-account');
    this.router.navigate(['/logout']);
    this.toast.success("Đăng xuất thành công!")
    this.infoService.setUser(null);
  }
}
