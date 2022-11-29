import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { orderStore } from 'src/app/admin/create-order/order.repository';
import { SelectImeiComponent } from 'src/app/admin/create-order/select-imei/select-imei.component';
import { ProductsService } from 'src/app/admin/products/products.service';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';

@Component({
  selector: 'app-exchange-product',
  templateUrl: './exchange-product.component.html',
  styleUrls: ['./exchange-product.component.scss'],
})
export class ExchangeProductComponent implements OnInit {
  @Input('currentOrderDetail') currentOrderDetail!: OrderDetailDto;
  @Input('currentImei') currentImei!: ImeiDto;
  searchTerm = '';
  subProducts!: Subscription;
  products: ProductDto[] = [];
  private searchTerms = new Subject<string>();
  constructor(
    private productsService: ProductsService,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}
  ngOnDestroy() {
    this.subProducts.unsubscribe();
  }
  ngOnInit(): void {
    this.subProducts = this.searchTerms
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term: string) => this.productsService.getProducts(term))
      )
      .subscribe((res) => {
        this.products = res;
      });
  }
  selectOptionValue(
    i_option: number,
    i_product: number,
    i_optionValue: number,
    currentSelected: boolean
  ) {
    this.products[i_product].optionDtos![i_option].optionValueDtos =
      this.products[i_product].optionDtos![i_option].optionValueDtos.map(
        (opv) => ({
          ...opv,
          selected: false,
        })
      );
    this.products[i_product].optionDtos![i_option].optionValueDtos[
      i_optionValue
    ].selected = !currentSelected;
  }
  openModalSelectImei(product: ProductDto) {
    let optionValuesSelected = product.optionDtos?.map((option) => {
      return option.optionValueDtos.find((optionValue) => optionValue.selected);
    }) as OptionValueDto[];
    let productDetail: any;
    product.productDetailDtos.forEach((proDetail) => {
      if (
        proDetail.productVariantCombinationDtos!.every(
          (productVariantCombinationDto, i) =>
            optionValuesSelected[i].id ==
            productVariantCombinationDto.optionValueDto?.id
        )
      ) {
        productDetail = proDetail;
        console.log(productDetail);
      }
    });
    if (productDetail.priceSell < this.currentOrderDetail.priceSell) {
      this.message.error('Vui lòng chọn sản phẩm có giá trị lớn hơn hoặc bằng');
    } else {
      const modal = this.modal.create({
        nzTitle: 'Chọn Imei',
        nzContent: SelectImeiComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzComponentParams: {
          productDetail,
          orderId: orderStore.getValue().orderDto.id,
          currentImei: this.currentImei,
          currentOrderDetail: this.currentOrderDetail,
          isExchange: true,
        },
        nzFooter: [],
      });
      const instance = modal.getContentComponent();
    }
  }
  search(term: any): void {
    this.searchTerms.next(term);
  }
}
