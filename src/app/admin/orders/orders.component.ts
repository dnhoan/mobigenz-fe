import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.ordersService.getOrders('').subscribe((res) => {
      this.orders = res;
    });
  }

  openEditOrder(id: number) {
    this.router.navigate([`/admin/order/${id}`]);
  }
}
