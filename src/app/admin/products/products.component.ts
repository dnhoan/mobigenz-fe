import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  UIEntitiesRef,
  updateEntities,
} from '@ngneat/elf-entities';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Observable } from 'rxjs';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { environment } from 'src/environments/environment';
import { ProductDetailComponent } from './product-detail/product-detail.component';
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
    private productsRepository: ProductsRepository,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.httpClient
      .get(`${environment.baseUrl}/test/products`)
      .subscribe((res: any) => {
        this.productsRepository.setProducts(res.data.products);
      });
    productsStore.pipe(selectAllEntities()).subscribe((products: any) => {
      this.products = products;
      console.log(this.products);
    });
  }

  openDrawer(productId: number | string) {
    // productsStore.update(
    //   addEntities({ id: productId, isOpen: true }, { ref: UIEntitiesRef })
    // );

    const drawerRef = this.drawerService.create<
      ProductDetailComponent,
      { value: string },
      string
    >({
      nzTitle: 'Chi tiết sản phẩm',
      nzWidth: '50%',
      nzContent: ProductDetailComponent,
      nzContentParams: {
        productId: productId,
      },
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe((data) => {
      console.log('destroy');
      // productsStore.update(deleteEntities(productId, { ref: UIEntitiesRef }));
    });
  }
}
