import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  visible = false;
  constructor() {}

  ngOnInit(): void {}

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
