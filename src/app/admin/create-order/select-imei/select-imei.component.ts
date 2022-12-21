import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { lastValueFrom } from 'rxjs';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { ProductDetailCartDto } from 'src/app/DTOs/ProductDetailCartDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { OrdersService } from '../../orders/orders.service';
import { ExchangeImei, ImeiService } from '../../products/imei/imei.service';
import { orderStore } from '../order.repository';

@Component({
  selector: 'app-select-imei',
  templateUrl: './select-imei.component.html',
  styleUrls: ['./select-imei.component.scss'],
})
export class SelectImeiComponent implements OnInit {
  @Input('productDetail') productDetail!: any;
  @Input('currentOrderDetail') currentOrderDetail!: OrderDetailDto;
  @Input('currentImei') currentImei!: ImeiDto;
  @Input('orderId') orderId!: number;
  @Input('isExchange') isExchange: boolean = false;
  listImei: ImeiDto[] = [];
  listImeiSelected: ImeiDto[] = [];
  constructor(
    private imeiService: ImeiService,
    private orderService: OrdersService,
    private modal: NzModalRef
  ) {}
  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }
  ngOnInit(): void {
    this.imeiService
      .getImeisInStockByProductDetailId(this.productDetail.id!)
      .subscribe((imeis) => {
        this.listImei = imeis;
      });
  }
  async addToOrder() {
    this.productDetail.imeis = this.listImeiSelected;
    orderStore.update((state: any) => {
      let currentOrderDto = state.orderDto;
      let i_exist = currentOrderDto.orderDetailDtos.findIndex(
        (orderDetailDto: OrderDetailDto) =>
          orderDetailDto.productDetailCartDto.id == this.productDetail.id
      );
      if (i_exist >= 0) {
        //  thêm imei
        if (this.orderId) {
          lastValueFrom(
            this.imeiService.addImeisToOrderDetail(
              currentOrderDto.orderDetailDtos[i_exist].id,
              this.productDetail.id,
              this.listImeiSelected
            )
          ).then((res) => {
            this.listImeiSelected = res;
          });
        }
        let imeiDtoList = currentOrderDto.orderDetailDtos[
          i_exist
        ].imeiDtoList.concat(this.listImeiSelected);
        currentOrderDto.orderDetailDtos[i_exist] = {
          ...currentOrderDto.orderDetailDtos[i_exist],
          amount: imeiDtoList.length,
          imeiDtoList,
        };
        currentOrderDto.goodsValue = this.calGoodsValue(
          currentOrderDto.orderDetailDtos
        );
      } else {
        //  tạo đơn hàng chi tiết và thêm imei
        let newOrderDetail = {
          amount: this.listImeiSelected.length,
          productDetailCartDto: {
            ...this.productDetail,
          } as ProductDetailCartDto,
          priceSell: this.productDetail.priceSell,
          productPrice: this.productDetail.priceSell,
          imeiDtoList: this.listImeiSelected,
        } as OrderDetailDto;
        if (this.orderId) {
          lastValueFrom(
            this.orderService.createOrderDetailToOrder(
              this.orderId,
              newOrderDetail
            )
          ).then((res) => {
            newOrderDetail = res;
            currentOrderDto.orderDetailDtos.push(newOrderDetail);
            currentOrderDto.goodsValue = this.calGoodsValue(
              currentOrderDto.orderDetailDtos
            );
          });
        } else {
          currentOrderDto.orderDetailDtos.push(newOrderDetail);
          currentOrderDto.goodsValue = this.calGoodsValue(
            currentOrderDto.orderDetailDtos
          );
        }
      }
      currentOrderDto.quantity = currentOrderDto.orderDetailDtos.length;
      return { orderDto: currentOrderDto };
    });
  }
  exchangeProduct() {
    // order detail has 1 imei
    // order detail the same product => update order_detail_id in imei
    // order detail the different product => remove current order detail and create new order detail

    // order detail has more than 1 imei
    // order detail the same product => update order_detail_id in imei
    // order detail the different product => create new order detail and remove current order detail id
    if (
      this.currentOrderDetail.productDetailCartDto.id == this.productDetail.id
    ) {
      let data: ExchangeImei = {
        currentOrderDetailId: this.currentOrderDetail.id!,
        newImeiId: this.listImeiSelected[0].id,
        oldImeiId: this.currentImei.id,
      };
      this.imeiService.exchangeImeiTheSameOrderDetail(data).subscribe((res) => {
        if (res) {
          window.location.reload();
          console.log(res);
        }
      });
    } else {
      let newOrderDetail = {
        amount: this.listImeiSelected.length,
        productDetailCartDto: {
          ...this.productDetail,
        } as ProductDetailCartDto,
        priceSell: this.productDetail.priceSell,
        productPrice: this.productDetail.priceSell,
        imeiDtoList: this.listImeiSelected,
      } as OrderDetailDto;
      if (this.currentOrderDetail.imeiDtoList?.length! > 1) {
        this.orderService
          .createOrderDetailWhenExchangeImei(
            this.orderId,
            this.currentImei.id,
            newOrderDetail
          )
          .subscribe((res) => {
            window.location.reload();
          });
      } else {
        this.orderService
          .changeOrderDetail(
            this.orderId,
            this.currentOrderDetail.id!,
            newOrderDetail
          )
          .subscribe((res) => {
            window.location.reload();
            console.log(res);
          });
      }
    }
  }
  calGoodsValue(orderDetailDtos: OrderDetailDto[]) {
    return orderDetailDtos.reduce((a: any, b: any) => {
      return a + b.priceSell * b.amount;
    }, 0);
  }
}
