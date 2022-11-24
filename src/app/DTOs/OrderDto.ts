import { CustomerDTO } from '../admin/customer/customer.model';
import { OrderDetailDto } from './OrderDetailDto';

export interface OrderDto {
  id: number;
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  goodsValue: number;
  quantity: number;
  totalMoney: number;
  shipFee?: number;
  shipDate?: string;
  delivery?: number;
  carrier: string;
  checkout: number;
  payStatus: number;
  orderStatus: number;
  customerDTO: CustomerDTO;
  orderDetailDtos: OrderDetailDto[];
  transactionDto?: {};
  note: string;
  cancelNote?: string;
  ctime?: string;
  mtime?: string;
}
