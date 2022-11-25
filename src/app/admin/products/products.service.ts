import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { ManufacturerDto } from 'src/app/DTOs/ManufacturerDto';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { SpecificationGroupDto } from 'src/app/DTOs/SpecificationGroupDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = `${environment.baseUrl}/admin`;
  downloadURL!: Observable<string>;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
    private storage: AngularFireStorage
  ) {}

  getManufacturers(): Observable<ManufacturerDto[]> {
    return this.httpClient.get(`${this.baseUrl}/manufacturers`).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          return res.data.manufacturers;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error get manufacturers', []))
    );
  }
  getProducts(searchTerm?: string): Observable<ProductDto[]> {
    return this.httpClient
      .get(
        `${environment.baseUrl}/admin/products/?searchTerm=${
          searchTerm ? searchTerm : ''
        }`
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.products;
          }
          return [];
        }),
        catchError(this.handleError<any>('Error get products', []))
      );
  }
  getOptions(): Observable<OptionDto[]> {
    return this.httpClient.get(`${this.baseUrl}/options`).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          return res.data.options;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error get options', []))
    );
  }
  getSpecificationGroups(): Observable<SpecificationGroupDto[]> {
    return this.httpClient.get(`${this.baseUrl}/specificationGroups`).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          return res.data.specificationGroups;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error get options', []))
    );
  }

  createProduct(product: ProductDto) {
    return this.httpClient.post(`${this.baseUrl}/product`, product).pipe(
      map((res: any) => {
        if (res.statusCode === 201) {
          return res.data.product;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error create product', []))
    );
  }

  uploadImage(file: File) {
    let url_image: string = '';
    var n = Date.now();
    const filePath = `product_images/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`product_images/${n}`, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe((url: any) => {
          if (url) {
            url_image = url;
          }
        });
      }),
      catchError(this.handleError<any>('Error upload image', []))
    );
    return url_image;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }
}
