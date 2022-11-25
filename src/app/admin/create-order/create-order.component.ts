import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ORDER_STATUS } from 'src/app/constants';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { OrdersService } from '../orders/orders.service';
import { ImeiService } from '../products/imei/imei.service';
import { ProductsService } from '../products/products.service';
import { orderInit, orderStore } from './order.repository';
import { SelectImeiComponent } from './select-imei/select-imei.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  isEdit = false;
  products: ProductDto[] = [];
  searchTerm = '';
  subProducts!: Subscription;
  subOrder!: Subscription;
  order!: OrderDto;
  private searchTerms = new Subject<string>();

  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private imeiService: ImeiService,
    private router: Router
  ) {}

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
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.orderService.getOrderById(id).subscribe((orderDto) => {
        orderStore.update(() => ({
          orderDto,
        }));
      });
    } else {
      orderStore.update(() => ({
        orderDto: orderInit,
      }));
    }

    this.subOrder = orderStore.subscribe((state) => {
      console.log(state);
      this.order = state.orderDto;
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
    let productDetail = {};
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

    const modal = this.modal.create({
      nzTitle: 'Chọn Imei',
      nzContent: SelectImeiComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        productDetail,
        orderId: this.order.id,
      },
      nzFooter: [],
    });
    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal.afterClose.subscribe((result) =>
      console.log('[afterClose] The result is:', result)
    );
  }
  search(term: any): void {
    this.searchTerms.next(term);
  }
  ngOnDestroy() {
    this.subProducts.unsubscribe();
    this.subOrder.unsubscribe();
  }
  noteChange(note: any) {
    orderStore.update((state: any) => {
      return {
        orderDto: { ...state.orderDto, note },
      };
    });
  }
  removeImei(
    i_imei: number,
    i_order_detail: number,
    imeiId: number,
    orderDetailId: number
  ) {
    let orderDetail = this.order.orderDetailDtos[i_order_detail];
    if (orderDetail.imeiDtoList?.length == 1) {
      if (this.isEdit)
        this.orderService.deleteOrderDetail(orderDetailId).subscribe((res) => {
          if (res) this.order.orderDetailDtos.splice(i_order_detail, 1);
        });
      else this.order.orderDetailDtos.splice(i_order_detail, 1);
    } else {
      if (this.isEdit)
        this.imeiService.deleteOrderDetailToImei(imeiId).subscribe((res) => {
          if (res) orderDetail.imeiDtoList?.splice(i_imei, 1);
        });
      else orderDetail.imeiDtoList?.splice(i_imei, 1);
      this.order.orderDetailDtos[i_order_detail] = orderDetail;
    }
    orderStore.update(() => ({ orderDto: this.order }));
  }
  save() {
    this.orderService.saveOrder(this.order).subscribe((res) => {
      console.log(res);
      this.order = res;
      if (!this.isEdit) this.router.navigate(['/admin/orders']);
    });
    console.log(this.order);
  }
}
