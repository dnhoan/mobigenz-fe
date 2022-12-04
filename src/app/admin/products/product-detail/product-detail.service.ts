import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ManufacturerDto } from 'src/app/DTOs/ManufacturerDto';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { ProductLineDto } from 'src/app/DTOs/ProductLineDto';
import { SpecificationDto } from 'src/app/DTOs/SpecificationDto';
import { SpecificationGroupDto } from 'src/app/DTOs/SpecificationGroupDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
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
  createManufacturer(
    manufacturerDto: ManufacturerDto
  ): Observable<ManufacturerDto[]> {
    return this.httpClient
      .post(`${this.baseUrl}/manufacturers`, manufacturerDto)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Tạo thành công');
            return res.data.manufacturer;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error create manufacturer', false))
      );
  }
  createProductLine(
    manufacturerId: number,
    productLineDto: ProductLineDto
  ): Observable<ProductLineDto[]> {
    return this.httpClient
      .post(`${this.baseUrl}/productLine/${manufacturerId}`, productLineDto)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Tạo thành công');
            return res.data.productLine;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error create productLine', false))
      );
  }
  createOption(optionName: string): Observable<OptionDto[]> {
    return this.httpClient.post(`${this.baseUrl}/options`, optionName).pipe(
      map((res: any) => {
        if (res.statusCode === 201) {
          this.message.success('Tạo thành công');
          return res.data.option;
        }
        return false;
      }),
      catchError(this.handleError<any>('Error create option', false))
    );
  }
  createOptionValue(
    option_id: number,
    optionValueName: string
  ): Observable<OptionValueDto[]> {
    return this.httpClient
      .post(`${this.baseUrl}/optionValue/${option_id}`, optionValueName)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Tạo thành công');
            return res.data.optionValue;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error create option value', false))
      );
  }
  createSpecificationGroup(
    specificationGroupName: string
  ): Observable<SpecificationGroupDto[]> {
    return this.httpClient
      .post(`${this.baseUrl}/specificationGroup`, specificationGroupName)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Tạo thành công');
            return res.data.specificationGroup;
          }
          return false;
        }),
        catchError(
          this.handleError<any>('Error create specification group', false)
        )
      );
  }
  createSpecification(
    specification_id: number,
    specificationName: string
  ): Observable<SpecificationDto[]> {
    return this.httpClient
      .post(
        `${this.baseUrl}/specification/${specification_id}`,
        specificationName
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Tạo thành công');
            return res.data.specification;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error create specification', false))
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
          this.message.success('Thành công');
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
