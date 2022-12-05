import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { productsStore } from '../products.repository';
import { ImeiService } from './imei.service';
import { updateEntities } from '@ngneat/elf-entities';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { utils } from 'xlsx';
export interface ImeiUpload {
  imei: string;
  error?: string;
}
@Component({
  selector: 'app-imei',
  templateUrl: './imei.component.html',
  styleUrls: ['./imei.component.scss'],
})
export class ImeiComponent implements OnInit, OnDestroy {
  @Input('productDetailId') productDetail!: ProductDetailDto;
  @Input('productId') productId!: number | string;
  @Input('i_product_detail') i_product_detail: number = -1;
  newImei = '';
  fileName: string = 'uploadFile.xlsx';
  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    },
  ];
  hasErrorUploadFile = false;
  // imeis: ImeiDto[] = [];
  dataUpload: ImeiUpload[] = [];
  isLoading = false;
  constructor(private imeiService: ImeiService) {}

  ngOnInit(): void {
    this.currentImei = { ...this.fakeImei } as ImeiDto;
    this.isLoading = true;
    this.imeiService
      .getImeisByProductDetailId(this.productDetail.id!)
      .subscribe((imeis) => {
        this.productDetail.imeis = imeis;
      });
    this.isLoading = false;
  }
  edit(imei: ImeiDto) {
    this.currentImei = { ...imei };
  }
  addImei() {
    this.imeiService
      .save({ ...this.currentImei, productDetailDto: this.productDetail })
      .subscribe((imei: any) => {
        if (imei) {
          if (!this.currentImei.id) {
            this.productDetail.imeis?.unshift(imei);
            this.productDetail.stock = this.productDetail.stock + 1;
          } else {
            let i = this.productDetail.imeis?.findIndex(
              (imei) => imei.id == this.currentImei.id
            ) as number;
            if (i >= 0) {
              this.productDetail.imeis![i] = imei;
            }
          }
          console.log(this.productDetail);

          productsStore.update(
            updateEntities(this.productId, (product) => {
              let productDetailDtos = product.productDetailDtos;
              productDetailDtos[this.i_product_detail] = this.productDetail;
              return {
                ...product,
                expand: true,
                productDetailDtos,
              };
            })
          );
          this.currentImei = { ...this.fakeImei } as ImeiDto;
        }
      });
  }

  deleteImei(idImei: number, i_imei: number) {
    this.imeiService.deleteImei(idImei).subscribe((res) => {
      if (res) {
        this.productDetail.imeis?.splice(i_imei, 1);
        productsStore.update(
          updateEntities(this.productId, (product) => {
            let productDetailDtos = product.productDetailDtos;
            productDetailDtos[this.i_product_detail] = this.productDetail;
            this.productDetail.stock = this.productDetail.stock - 1;
            return {
              ...product,
              expand: true,
              productDetailDtos,
            };
          })
        );
      }
    });
  }
  ngOnDestroy(): void {
    console.log('on destroy imei');
  }
  onFileChange(evt: any) {
    this.hasErrorUploadFile = false;
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Không thể sử dụng file');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      this.dataUpload = utils.sheet_to_json<ImeiUpload>(
        wb.Sheets[wb.SheetNames[0]]
      );
      console.log(this.dataUpload);

      this.dataUpload = this.dataUpload.map((res) => {
        console.log(res);

        return { imei: res.imei };
      });
      console.log(this.dataUpload);
      this.imeiService
        .batchSaveImei(this.productDetail.id!, this.dataUpload)
        .subscribe((res: any) => {
          if (res.statusCode == 201) {
            this.productDetail.imeis = this.productDetail.imeis?.concat(
              res.data.data
            );
          } else if (res.statusCode == 400) {
            this.hasErrorUploadFile = true;
            this.dataUpload = res.data.data;
          }
        });
    };
    reader.readAsBinaryString(target.files[0]);
    console.log('dataa ', this.dataUpload);
  }
  downloadFileError() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataUpload);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
  currentImei!: ImeiDto;
  fakeImei = {
    id: 0,
    imei: '',
    status: 1,
    productDetailDto: {} as ProductDetailDto,
  };
}
