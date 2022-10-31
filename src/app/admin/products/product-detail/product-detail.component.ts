import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  selectEntities,
  selectEntity,
  UIEntitiesRef,
  unionEntities,
} from '@ngneat/elf-entities';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize, Observable, Subscription, throwIfEmpty } from 'rxjs';
import { ManufacturerDto } from 'src/app/DTOs/ManufacturerDto';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { ProductLineDto } from 'src/app/DTOs/ProductLineDto';
import { ProductVariantCombinationDto } from 'src/app/DTOs/ProductVariantCombinationDto';
import { SpecificationDto } from 'src/app/DTOs/SpecificationDto';
import { SpecificationGroupDto } from 'src/app/DTOs/SpecificationGroupDto';
import { environment } from 'src/environments/environment';
import { ProductDtoUI, productsStore } from '../products.repository';
import { ProductDetailService } from './product-detail.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() productId!: number | string;
  product!: any;
  productUI$!: Subscription;
  manufacturers: ManufacturerDto[] = [];
  options: OptionDto[] = [];
  productLines: ProductLineDto[] = [];
  specificationGroups: SpecificationGroupDto[] = [];
  baseUrl = `${environment.baseUrl}/admin`;
  constructor(
    private productDetailService: ProductDetailService,
    private httpClient: HttpClient,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.productDetailService.getManufacturers().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
    });

    this.productDetailService.getOptions().subscribe((options) => {
      this.options = options;
    });

    this.productDetailService
      .getSpecificationGroups()
      .subscribe((specificationGroups) => {
        this.specificationGroups = specificationGroups;
      });

    if (this.productId) {
      this.productUI$ = productsStore
        .pipe(selectEntity(this.productId))
        .subscribe((product) => (this.product = { ...product }));
    } else {
      this.product = this.fakeProduct;
    }
  }

  addOption() {
    this.product.optionDtos.push({
      id: '',
      optionName: '',
      optionValueDtos: [],
    });
  }
  onChangeOption(id: number, i_option: number) {
    let option = this.options.find((opt) => opt.id == id) as OptionDto;
    this.product.optionDtos[i_option] = {
      id: option.id,
      optionName: option.optionName,
      optionValueDtos: [],
    };
    console.log(this.product);

    this.mapSku();
  }
  removeOptionProduct(i_option: number) {
    this.product.optionDtos.splice(i_option, 1);
    this.mapSku();
  }
  addOptionValue(i_option: number) {
    this.product.optionDtos[i_option].optionValueDtos.push({
      id: '',
      optionValueName: '',
    });
  }
  onChangeOptionValue(
    option_value_id: any,
    i_option: number,
    i_option_value: number,
    option_id: number
  ) {
    this.options
      .find((option) => option.id == option_id)
      ?.optionValueDtos.forEach((optionValue) => {
        if (optionValue.id == option_value_id) {
          this.product.optionDtos[i_option].optionValueDtos[i_option_value] =
            optionValue;
        }
      });
    this.mapSku();
  }
  removeOptionValueProduct(i_option: number, i_option_value: number) {
    this.product.optionDtos[i_option].optionValueDtos.splice(i_option_value, 1);
    this.mapSku();
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
        };
      }
    });
  }
  mapSku() {
    this.product.productDetailDtos = [];
    let sku1: any[] = [];
    let sku2: any[] = [];
    if (this.product.optionDtos.length)
      this.product.optionDtos[0].optionValueDtos.forEach((optionValue: any) => {
        sku1.push(optionValue);
        this.product.productDetailDtos.push({
          priceOrigin: 0,
          priceSell: 0,
          sku: optionValue.optionValueName,
          image: '',
          productVariantCombinationDtos: [
            {
              optionDto: this.product.optionDtos[0],
              optionValueDto: optionValue,
            },
          ] as ProductVariantCombinationDto[],
        });
      });
    if (
      this.product.optionDtos.length == 2 &&
      this.product.optionDtos[1].optionValueDtos &&
      this.product.optionDtos[1].optionValueDtos.length
    ) {
      this.product.productDetailDtos = [];
      sku1.forEach((sku) => {
        this.product.optionDtos[1].optionValueDtos.forEach(
          (optionValue: any) => {
            sku2.push([sku, optionValue]);
            this.product.productDetailDtos.push({
              priceOrigin: 0,
              priceSell: 0,
              sku: sku.optionValueName + ', ' + optionValue.optionValueName,
              image: '',
              productVariantCombinationDtos: [
                {
                  optionDto: this.product.optionDtos[0],
                  optionValueDto: sku,
                },
                {
                  optionDto: this.product.optionDtos[1],
                  optionValueDto: optionValue,
                },
              ] as ProductVariantCombinationDto[],
            });
          }
        );
      });
    }
    console.log(this.product);

    console.log(this.product.productDetailDtos);
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
    // this.product.optionDtos.forEach((optionProduct: any) => {
    //   this.product.optionDtos.push(optionProduct.currentOption);
    // });
    delete this.product['id'];
    console.log(this.product);

    this.productDetailService
      .createProduct(this.product)
      .subscribe((product) => {
        this.product = product;
        productsStore.update(addEntities(product));
      });
  }
  createOption(event: any) {}
  addManufacturer(input: HTMLInputElement) {
    let value = input.value;
    console.log(value);

    if (value) {
      // create manufacture
    }
  }
  addProductLine(input: HTMLInputElement) {
    let value = input.value;
    console.log(value);

    if (value) {
      // create manufacture
    }
  }
  fakeProduct: ProductDto = {
    id: '',
    productName: '',
    description: '',
    images: [],
    manufacturerDto: {
      id: undefined,
      productLineDtos: [],
      manufacturerName: '',
    },
    productLineDto: { id: undefined, productLineName: '' },
    productDetailDtos: [],
    optionDtos: [],
    specificationGroupDtos: [],
    note: '',
  };
  ngOnDestroy() {
    if (this.productId) this.productUI$.unsubscribe();
  }
}
