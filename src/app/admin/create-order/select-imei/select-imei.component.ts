import { Component, Input, OnInit } from '@angular/core';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { ProductDetailCartDto } from 'src/app/DTOs/ProductDetailCartDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { OrdersService } from '../../orders/orders.service';
import { ImeiService } from '../../products/imei/imei.service';
import { orderStore } from '../order.repository';

@Component({
  selector: 'app-select-imei',
  templateUrl: './select-imei.component.html',
  styleUrls: ['./select-imei.component.scss'],
})
export class SelectImeiComponent implements OnInit {
  @Input('productDetail') productDetail!: any;
  @Input('orderId') orderId!: number;
  listImei: ImeiDto[] = [];
  listImeiSelected: ImeiDto[] = [];
  constructor(
    private imeiService: ImeiService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    this.imeiService
      .getImeisInStockByProductDetailId(this.productDetail.id!)
      .subscribe((imeis) => {
        this.listImei = imeis;
      });
  }
  addToOrder() {
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
          this.imeiService
            .addImeisToOrderDetail(
              currentOrderDto.orderDetailDtos[i_exist].id,
              this.productDetail.id,
              this.listImeiSelected
            )
            .subscribe((res) => {
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
          this.orderService
            .createOrderDetailToOrder(this.orderId, newOrderDetail)
            .subscribe((res) => {
              newOrderDetail = res;
              currentOrderDto.orderDetailDtos.push(newOrderDetail);
            });
        } else {
          currentOrderDto.orderDetailDtos.push(newOrderDetail);
        }
      }
      let totalMoney = currentOrderDto.orderDetailDtos.reduce(
        (a: number, b: OrderDetailDto) => a + b.amount * b.priceSell,
        0
      );
      currentOrderDto.totalMoney = totalMoney;
      currentOrderDto.quantity = currentOrderDto.orderDetailDtos.length;
      return { orderDto: currentOrderDto };
    });
  }
}
