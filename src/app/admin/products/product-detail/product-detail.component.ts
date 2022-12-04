import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addEntities, getEntity, updateEntities } from '@ngneat/elf-entities';
import { finalize, Subscription } from 'rxjs';
import { ManufacturerDto } from 'src/app/DTOs/ManufacturerDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { ProductLineDto } from 'src/app/DTOs/ProductLineDto';
import { SpecificationGroupDto } from 'src/app/DTOs/SpecificationGroupDto';
import { environment } from 'src/environments/environment';
import { productsStore } from '../products.repository';
import { ProductDetailService } from './product-detail.service';
import { productInit, productStore } from './product.repository';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() productId!: number | string;
  product!: any;
  product$!: Subscription;
  manufacturers: ManufacturerDto[] = [];

  productLines: ProductLineDto[] = [];
  specificationGroups: SpecificationGroupDto[] = [];
  baseUrl = `${environment.baseUrl}/admin`;
  modulesDescription = {};
  constructor(
    private productDetailService: ProductDetailService,
    private httpClient: HttpClient,
    private storage: AngularFireStorage
  ) {
    this.modulesDescription = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    };
  }

  ngOnInit() {
    this.productDetailService.getManufacturers().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
      console.log(manufacturers);
    });

    this.productDetailService
      .getSpecificationGroups()
      .subscribe((specificationGroups) => {
        this.specificationGroups = specificationGroups;
      });

    if (this.productId) {
      productStore.update(
        (state) =>
          ({
            ...productsStore.query(getEntity(this.productId)),
          } as ProductDto)
      );
    }
    this.product$ = productStore.subscribe((product) => {
      this.product = product;
    });
  }

  addSpecificationGroup() {
    this.product.specificationGroupDtos.push({
      id: '',
      specificationGroupName: '',
      specificationDtos: [],
    });
    console.log(this.product);
  }
  addSpecificationProduct(index: number) {
    this.product.specificationGroupDtos[index].specificationDtos.push({
      id: '',
      specificationName: '',
      value: '',
      specificationDtos: [],
    });
    console.log(this.product);
  }

  changeImage(event: any) {
    let n = Date.now();
    const file = event.target.files[0];
    const filePath = `product_images/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`product_images/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            if (url) {
              this.product.images.push(url);
            }
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
  }

  onChangeSpecificationGroupProduct(
    specification_group_id: SpecificationGroupDto,
    i_specification_group: number
  ) {
    let specificationGroup = this.specificationGroups.find(
      (specificationGroup: any) =>
        specificationGroup.id == specification_group_id
    ) as SpecificationGroupDto;
    this.product.specificationGroupDtos[i_specification_group] = {
      id: specificationGroup.id,
      specificationName: specificationGroup.specificationGroupName,
      specificationDtos: [],
    };
    console.log(this.product);
  }
  removeSpecificationGroup(i_specification_group: number) {
    this.product.specificationGroupDtos.splice(i_specification_group, 1);
  }
  removeSpecificationProduct(
    i_specification_group: number,
    i_specification: number
  ) {
    this.product.specificationGroupDtos[
      i_specification_group
    ].specificationDtos.splice(i_specification, 1);
  }
  onChangeSpecification(
    specification_id: any,
    specification_group_id: number,
    i_specification_group: number,
    i_specification: number
  ) {
    let specificationGroup = this.specificationGroups.find(
      (specificationGroup: any) =>
        specificationGroup.id == specification_group_id
    ) as SpecificationGroupDto;
    specificationGroup.specificationDtos.forEach((specification) => {
      if (specification.id == specification_id) {
        this.product.specificationGroupDtos[
          i_specification_group
        ].specificationDtos[i_specification] = {
          id: specification.id,
          specificationName: specification.specificationName,
          value: '',
          productSpecificationDtos: {
            id: '',
            productSpecificationName: '',
          },
        };
      }
    });
  }

  onChangeManufacturer(manufacture_id: any) {
    this.product.manufacturerDto = this.manufacturers.find(
      (manufacture) => manufacture.id == manufacture_id
    );
    this.product.productLineDto = { id: '' };
  }
  onChangeProductLine(product_line_id: any) {
    this.product.productLineDto =
      this.product.manufacturerDto.productLineDtos.find(
        (productLineDto: any) => productLineDto.id == product_line_id
      );
  }
  save() {
    this.productDetailService
      .createProduct(this.product)
      .subscribe((product) => {
        this.product = product;
        productsStore.update(
          this.productId
            ? updateEntities(this.productId, product)
            : addEntities(product)
        );
      });
  }

  addManufacturer(input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.productDetailService
        .createManufacturer({ id: 0, manufacturerName: value })
        .subscribe((res: any) => {
          if (res) {
            this.manufacturers.unshift(res);
            input.value = '';
          }
        });
    }
  }
  addProductLine(input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.productDetailService
        .createProductLine(this.product!.manufacturerDto.id, {
          id: 0,
          productLineName: value,
        })
        .subscribe((res: any) => {
          if (res) {
            let i_manufacturer = this.manufacturers.findIndex(
              (man) => man.id == this.product.manufacturerDto.id
            );
            this.manufacturers[i_manufacturer].productLineDtos?.unshift(res);
            input.value = '';
          }
        });
    }
  }
  editorInstance: any;
  imageHandler(event: any) {
    this.editorInstance = event;
    let toolbar = event.getModule('toolbar');
    toolbar.addHandler('image', () => {
      let data = this.editorInstance;
      if (this.editorInstance) {
        let range = this.editorInstance.getSelection();
        if (range) {
          let input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.addEventListener('change', () => {
            const file = input.files![0];
            let n = Date.now();
            const filePath = `product_images/${n}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`product_images/${n}`, file);
            task
              .snapshotChanges()
              .pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe((url: any) => {
                    if (url) {
                      data.insertEmbed(range.index, 'image', url);
                    }
                  });
                })
              )
              .subscribe();
          });
          input.click();
        }
      }
    });
  }

  createSpecificationGroup(input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.productDetailService
        .createSpecificationGroup(value)
        .subscribe((res: any) => {
          if (res) {
            this.specificationGroups.unshift(res);
            input.value = '';
          }
        });
    }
  }
  createSpecification(specificationGroupId: number, input: HTMLInputElement) {
    let value = input.value;
    console.log('id ', specificationGroupId);
    let i_specification_group = this.specificationGroups.findIndex(
      (spe) => spe.id == specificationGroupId
    );
    if (value) {
      this.productDetailService
        .createSpecification(specificationGroupId, value)
        .subscribe((res: any) => {
          if (res) {
            this.specificationGroups[
              i_specification_group
            ].specificationDtos?.unshift(res);
            input.value = '';
          }
        });
    }
    console.log(this.specificationGroups);
  }
  ngOnDestroy() {
    if (this.productId) this.product$.unsubscribe();
    productStore.update((state) => ({ ...productInit }));
  }
}
