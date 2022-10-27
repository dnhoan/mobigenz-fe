import { Component, OnInit } from '@angular/core';
import { MockProductsService } from "./mock-products.service";

import { ProductDto } from "./ProductDto.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];

  constructor(
    private productService: MockProductsService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        (response: any) =>{
        this.products = response
      });
  }
  // products = [
  //   { id: 1, name: 'Iphone 11', image: '', price: 200 },
  //   { id: 2, name: 'Xiaomi Redmi 7', image: '', price: 200 },
  //   { id: 3, name: 'Samsung S22', image: '', price: 200 },
  //   { id: 4, name: 'POCO 11', image: '', price: 200 },
  //   { id: 5, name: 'Iphone 6', image: '', price: 200 },
  //   { id: 6, name: 'Ipad Air Max', image: '', price: 200 },
  //   { id: 7, name: 'Iphone 11 Pro Max', image: '', price: 200 },
  //   { id: 8, name: '1', image: '', price: 200 },
  //   { id: 9, name: '3', image: '', price: 200 },
  //   { id: 10, name: '5', image: '', price: 200 },
  // ]
}
