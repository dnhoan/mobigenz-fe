import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { selectAllEntities } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { environment } from 'src/environments/environment';
import { ProductsRepository, productsStore } from './products.repository';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  visible = false;
  products: ProductDto[] = [];
  constructor(
    private httpClient: HttpClient,
    private productsRepository: ProductsRepository
  ) {}

  ngOnInit(): void {
    this.httpClient
      .get(`${environment.baseUrl}test/products`)
      .subscribe((res: any) => {
        this.productsRepository.setProducts(res.data.products);
      });
    productsStore.pipe(selectAllEntities()).subscribe((products) => {
      this.products = products;
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
