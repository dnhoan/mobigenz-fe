import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxPrinterService } from 'ngx-printer';
import {
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ORDER_STATUS } from 'src/app/constants';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { CommonService } from 'src/app/service/common.service';
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
  nowDate = new Date();
  isEdit = false;
  products: ProductDto[] = [];
  searchTerm = '';
  subProducts!: Subscription;
  subOrder!: Subscription;
  order!: OrderDto;
  cancelNote: string = '';
  isShowConfirmCancelOrder = false;
  private searchTerms = new Subject<string>();

  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private imeiService: ImeiService,
    private router: Router,
    public commonService: CommonService,
    private printerService: NgxPrinterService,
    private message: NzMessageService
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
        console.log(orderDto);

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
  async openModalSelectImei(product: ProductDto) {
    let optionValuesSelected = product.optionDtos?.map((option) => {
      return option.optionValueDtos.find((optionValue) => optionValue.selected);
    }) as OptionValueDto[];
    let productDetail: any = {};

    if (optionValuesSelected.every((o) => o != undefined)) {
      product.productDetailDtos.forEach((proDetail) => {
        if (
          proDetail.productVariantCombinationDtos!.every(
            (productVariantCombinationDto, i) =>
              optionValuesSelected[i].id ==
              productVariantCombinationDto.optionValueDto?.id
          )
        ) {
          productDetail = proDetail;
        }
      });

      if (productDetail.stock! > 0) {
        let listImei: ImeiDto[] = [];
        let imeisSelected: ImeiDto[] = [];
        this.order.orderDetailDtos.forEach((orderDetail) => {
          imeisSelected = imeisSelected.concat(
            orderDetail.imeiDtoList ? orderDetail.imeiDtoList : []
          );
        });
        await lastValueFrom(
          this.imeiService.getImeisInStockByProductDetailId(productDetail.id!)
        ).then((imeis) => {
          listImei = imeis.filter(
            (i) => !imeisSelected.some((imei) => imei.imei == i.imei)
          );
        });

        const modal = this.modal.create({
          nzTitle: 'Chọn Imei',
          nzContent: SelectImeiComponent,
          nzViewContainerRef: this.viewContainerRef,
          nzComponentParams: {
            productDetail,
            orderId: this.order.id,
            listImei,
          },
          nzFooter: [],
        });
        const instance = modal.getContentComponent();
      } else {
        this.message.error('Sản phẩm này hết hàng');
      }
    } else {
      this.message.error('Vui lòng chọn phân loại sản phẩm');
    }
  }
  openModelAddImei(orderDetail: OrderDetailDto) {
    const modal = this.modal.create({
      nzTitle: 'Chọn Imei',
      nzContent: SelectImeiComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        productDetail: orderDetail.productDetailCartDto,
        orderId: this.order.id,
      },
      nzFooter: [],
    });
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
  async removeImei(
    i_imei: number,
    i_order_detail: number,
    imeiId: number,
    orderDetailId: number
  ) {
    let orderDetail = this.order.orderDetailDtos[i_order_detail];
    if (orderDetail.imeiDtoList?.length == 1) {
      if (this.isEdit)
        await lastValueFrom(
          this.orderService.deleteOrderDetail(orderDetailId)
        ).then((res) => {
          if (res) this.order.orderDetailDtos.splice(i_order_detail, 1);
        });
      else this.order.orderDetailDtos.splice(i_order_detail, 1);
    } else {
      if (this.isEdit)
        await lastValueFrom(
          this.imeiService.deleteOrderDetailToImei(imeiId)
        ).then((res) => {
          if (res) orderDetail.imeiDtoList?.splice(i_imei, 1);
        });
      else orderDetail.imeiDtoList?.splice(i_imei, 1);
      this.order.orderDetailDtos[i_order_detail] = orderDetail;
      this.order.orderDetailDtos[i_order_detail].amount =
        orderDetail.imeiDtoList?.length!;
    }
    this.order.goodsValue = this.calGoodsValue(this.order.orderDetailDtos);
    orderStore.update(() => {
      return { orderDto: this.order };
    });
  }
  updateGoodValueAndAmount() {}
  calGoodsValue(orderDetailDtos: OrderDetailDto[]) {
    return orderDetailDtos.reduce((a: any, b: any) => {
      return a + b.priceSell * b.amount;
    }, 0);
  }
  save() {
    this.order.totalMoney = this.order.shipFee! + this.order.goodsValue;
    this.order.orderStatus =
      this.order.checkout == this.order.totalMoney && this.order.delivery == 0
        ? 4
        : this.order.orderStatus;
    this.orderService.saveOrder(this.order).subscribe((res) => {
      this.order = res;
      if (!this.isEdit) this.router.navigate(['/admin/orders']);
    });
  }
  onIndexChange(event: any) {
    let currentStatus = this.order.orderStatus;
    switch (true) {
      case event == -2 && currentStatus == 4:
        this.updateStatus(this.order.id, event);
        break;
      case event == -1:
        this.isShowConfirmCancelOrder = true;
        break;
      case event == 1 && currentStatus == 0:
        this.updateStatus(this.order.id, event);
        break;
      case event == 2 && currentStatus == 1:
        this.updateStatus(this.order.id, event);
        break;
      case event == 3 && currentStatus == 2:
        this.updateStatus(this.order.id, event);
        break;
      case event == 4 &&
        (currentStatus == 3 ||
          (currentStatus == 1 && this.order.delivery == 0)):
        this.updateStatus(this.order.id, event);
        break;
      default:
        this.message.error('Không thể chuyển trạng thái');
        break;
    }
  }

  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.orderService
      .updateOrderStatus(orderId, newStatus, note)
      .subscribe((res) => {
        if (res) {
          this.order.orderStatus = newStatus;
          this.order.cancelNote = this.cancelNote;
        }
      });
  }
  printOrder() {
    this.nowDate = new Date();
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';
    head.appendChild(style);

    this.printerService.printDiv('printDiv');
  }
  handleOk() {
    this.updateStatus(this.order.id, -1, this.cancelNote);
    this.isShowConfirmCancelOrder = false;
  }
  handleCancel() {
    this.isShowConfirmCancelOrder = false;
  }
  saveOrderStore() {
    orderStore.update(() => ({ orderDto: this.order }));
  }
}
