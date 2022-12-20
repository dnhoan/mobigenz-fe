import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  UIEntitiesRef,
  updateEntities,
} from '@ngneat/elf-entities';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { expand, Observable, Subscription } from 'rxjs';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { environment } from 'src/environments/environment';
import { ImeiComponent } from './imei/imei.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsRepository, productsStore } from './products.repository';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  visible = false;
  products: ProductDto[] = [];
  subProducts!: Subscription;
  constructor(
    private httpClient: HttpClient,
    private productsRepository: ProductsRepository,
    private drawerService: NzDrawerService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res: any) => {
      this.productsRepository.setProducts(res);
    });
    this.subProducts = productsStore
      .pipe(selectAllEntities())
      .subscribe((products: any) => {
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

  openModalImei(
    productDetail: ProductDetailDto,
    productId?: number | string,
    i_product_detail?: number
  ) {
    const modal = this.modal.create({
      nzTitle: 'Imei/Serial',
      nzContent: ImeiComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        productDetail: { ...productDetail },
        productId,
        i_product_detail,
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [],
    });
    const instance = modal.getContentComponent();
  }
  deleteProductById(product_id: any) {
    this.productService.deleteProductById(product_id).subscribe((res) => {
      if (res) {
        productsStore.update(deleteEntities(product_id));
      }
    });
  }
  ngOnDestroy() {
    this.subProducts.unsubscribe();
  }
}
