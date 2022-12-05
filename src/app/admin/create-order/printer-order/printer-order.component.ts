import { Component, Input, OnInit } from '@angular/core';
import { OrderDto } from 'src/app/DTOs/OrderDto';

@Component({
  selector: 'app-printer-order',
  templateUrl: './printer-order.component.html',
  styleUrls: ['./printer-order.component.scss'],
})
export class PrinterOrderComponent implements OnInit {
  @Input('order') order!: OrderDto;
  constructor() {}

  ngOnInit(): void {}
}
