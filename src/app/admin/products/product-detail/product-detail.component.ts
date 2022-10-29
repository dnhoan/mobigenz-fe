import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
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

export interface OptionProduct {
  currentOption?: OptionDto;
  optionValues: any[];
}

export interface SpecificationProduct {
  currentSpecificationGroup?: SpecificationGroupDto;
  specifications: any[];
}

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
  specificationGroupProducts: SpecificationProduct[] = [];
  specificationGroups: SpecificationGroupDto[] = [];
  optionProducts: OptionProduct[] = [];
  productDetails: ProductDetailDto[] = [];
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
    this.optionProducts.push({
      currentOption: undefined,
      optionValues: [],
    });
  }
  addOptionValue(index: number) {
    this.optionProducts[index].optionValues.push({ optionName: '' });
  }
  addSpecificationGroup() {
    this.specificationGroupProducts.push({
      currentSpecificationGroup: undefined,
      specifications: [],
    });
  }
  addSpecificationProduct(index: number) {
    this.specificationGroupProducts[index].specifications.push({
      specificationName: '',
      value: '',
    });
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

  onChangeOption(option: OptionDto, i_option: number) {
    if (option) {
      this.optionProducts[i_option].currentOption = option;
      this.optionProducts[i_option].optionValues = [];
    } else {
      this.optionProducts.splice(i_option, 1);
    }
    this.mapSku();
  }
  onChangeOptionValue(
    optionValueDto: any,
    i_option: number,
    i_option_value: number
  ) {
    this.optionProducts[i_option].optionValues[i_option_value] = optionValueDto;
    this.mapSku();
  }
  onChangeSpecificationGroupProduct(
    specificationGroup: SpecificationGroupDto,
    i_specification_group: number
  ) {
    if (specificationGroup) {
      this.specificationGroupProducts[
        i_specification_group
      ].currentSpecificationGroup = specificationGroup;
      this.specificationGroupProducts[i_specification_group].specifications =
        [];
    } else {
      this.optionProducts.splice(i_specification_group, 1);
    }
  }
  onChangeSpecification(
    specification: any,
    i_specification_group: number,
    i_specification: number
  ) {
    this.specificationGroupProducts[i_specification_group].specifications[
      i_specification
    ] = specification;
  }
  mapSku() {
    this.productDetails = [];
    let sku1: any[] = [];
    let sku2: any[] = [];
    this.optionProducts[0].optionValues.forEach((optionValue) => {
      sku1.push(optionValue);
      this.productDetails.push({
        priceOrigin: 0,
        priceSell: 0,
        sku: optionValue.optionValueName,
        image: '',
        productVariantCombinationDtos: [
          {
            optionDto: this.optionProducts[0].currentOption,
            optionValueDto: optionValue,
          },
        ] as ProductVariantCombinationDto[],
      });
    });
    if (
      this.optionProducts.length == 2 &&
      this.optionProducts[1].optionValues.length
    ) {
      this.productDetails = [];
      sku1.forEach((sku) => {
        this.optionProducts[1].optionValues.forEach((optionValue) => {
          sku2.push([sku, optionValue]);
          this.productDetails.push({
            priceOrigin: 0,
            priceSell: 0,
            sku: sku.optionValueName + ', ' + optionValue.optionValueName,
            image: '',
            productVariantCombinationDtos: [
              {
                optionDto: this.optionProducts[0].currentOption,
                optionValueDto: sku,
              },
              {
                optionDto: this.optionProducts[1].currentOption,
                optionValueDto: optionValue,
              },
            ] as ProductVariantCombinationDto[],
          });
        });
      });
    }
    console.log(this.productDetails);
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
    this.optionProducts.forEach((optionProduct) => {
      this.product.optionDtos.push(optionProduct.currentOption);
    });
    this.product.productDetailDtos = this.productDetails.map(
      (productDetail) => {
        return {
          ...productDetail,
          productVariantCombinationDtos:
            productDetail.productVariantCombinationDtos,
        };
      }
    );
    this.product.specificationGroupDtos = this.specificationGroupProducts.map(
      (specificationGroupProduct) => {
        specificationGroupProduct.currentSpecificationGroup!.specificationDtos =
          specificationGroupProduct.specifications as SpecificationDto[];
        return {
          ...specificationGroupProduct.currentSpecificationGroup,
        };
      }
    );
    delete this.product['id'];
    console.log(this.product);

    this.productDetailService
      .createProduct(this.product)
      .subscribe((product) => {
        this.product = product;
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
