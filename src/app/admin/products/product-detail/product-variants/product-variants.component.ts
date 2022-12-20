import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OptionDto } from 'src/app/DTOs/OptionDto';
import { OptionValueDto } from 'src/app/DTOs/OptionValueDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { ProductDto } from 'src/app/DTOs/ProductDto';
import { ProductVariantCombinationDto } from 'src/app/DTOs/ProductVariantCombinationDto';
import { ProductDetailService } from '../product-detail.service';
import { productStore } from '../product.repository';

@Component({
  selector: 'app-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss'],
})
export class ProductVariantsComponent implements OnInit {
  @Input('product') product!: any;
  @Input('isEdit') isEdit: boolean = false;
  options: OptionDto[] = [];
  isVisibleSelectImage = false;
  constructor(
    private productDetailService: ProductDetailService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.productDetailService.getOptions().subscribe((options) => {
      this.options = options;
    });
    if (this.isEdit) {
      this.product.optionDtos = this.product.optionDtos.map((op: any) => ({
        ...op,
        isChange: false,
      }));
    }
  }

  addOption() {
    let option = {
      id: '',
      optionName: '',
      optionValueDtos: [],
      isChange: true,
    };
    this.product.optionDtos.push(option);
    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let newProductDetail = { ...productDetail };
          newProductDetail.productVariantCombinationDtos?.push({
            id: 0,
            optionDto: {
              id: 0,
              optionName: '',
              optionValueDtos: [],
            },
          });
          return newProductDetail;
        }
      );
  }
  onChangeOption(id: number, i_option: number) {
    let option = this.options.find((opt) => opt.id == id) as OptionDto;
    this.product.optionDtos[i_option] = {
      id: option.id,
      optionName: option.optionName,
      optionValueDtos: [],
      isChange: true,
    };
    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let newProductDetail = { ...productDetail };
          newProductDetail.productVariantCombinationDtos![i_option].optionDto =
            option;
          return newProductDetail;
        }
      );
    else this.mapSku();
    console.log(this.product.productDetailDtos);
  }
  removeOptionProduct(i_option: number) {
    this.product.optionDtos.splice(i_option, 1);
    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let newProductDetail: ProductDetailDto = { ...productDetail };
          newProductDetail.productVariantCombinationDtos?.splice(i_option, 1);
          newProductDetail.sku = newProductDetail
            .productVariantCombinationDtos!.map(
              (p) => p.optionValueDto?.optionValueName
            )
            .toString();
          return newProductDetail;
        }
      );
    else this.mapSku();
    if (this.product.productDetailDtos.length === 0) {
      this.product.productDetailDtos = [
        {
          image: '',
          priceOrigin: 0,
          priceSell: 0,
          sku: '',
          stock: 0,
          imeis: [],
          price: 0,
        },
      ];
    }
  }
  addOptionValue(i_option: number) {
    let optionValueDto = {
      id: 0,
      optionValueName: '',
      isChange: true,
    };
    this.product.optionDtos[i_option].optionValueDtos.push(optionValueDto);
    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let newProductDetail = { ...productDetail };
          newProductDetail.productVariantCombinationDtos![
            i_option
          ].optionValueDto = { id: 0, optionValueName: '', selected: true };
          return newProductDetail;
        }
      );
  }
  onChangeOptionValue(
    option_value_id: any,
    i_option: number,
    i_option_value: number,
    option_id: number
  ) {
    let optionSelected = this.options.find((option) => option.id == option_id);
    optionSelected?.optionValueDtos.forEach((optionValue) => {
      if (optionValue.id == option_value_id) {
        this.product.optionDtos[i_option].optionValueDtos[i_option_value] =
          optionValue;
      }
    });

    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let optionValue =
            this.product.optionDtos[i_option].optionValueDtos[i_option_value];
          let newProductDetail: ProductDetailDto = { ...productDetail };
          newProductDetail.productVariantCombinationDtos![
            i_option
          ].optionValueDto = optionValue;
          newProductDetail.sku = newProductDetail
            .productVariantCombinationDtos!.map(
              (p) => p.optionValueDto?.optionValueName
            )
            .toString();
          return newProductDetail;
        }
      );
    else this.mapSku();
    this.filterOptionValueSelected(i_option, option_id);
  }

  filterOptionValueSelected(i_option: number, option_id: number) {
    let option_index = this.options.findIndex(
      (option) => option.id == option_id
    );

    this.options[option_index].optionValueDtos = this.options[
      option_index
    ].optionValueDtos.map((optionValue) => {
      let isDisable = this.product.optionDtos[i_option].optionValueDtos.some(
        (optValue: any) => optValue.id == optionValue.id
      );
      return { ...optionValue, isDisable };
    });
  }
  removeOptionValueProduct(i_option: number, i_option_value: number) {
    this.product.optionDtos[i_option].optionValueDtos.splice(i_option_value, 1);
    if (this.isEdit)
      this.product.productDetailDtos = this.product.productDetailDtos.map(
        (productDetail: ProductDetailDto) => {
          let newProductDetail: ProductDetailDto = { ...productDetail };
          newProductDetail.productVariantCombinationDtos?.splice(i_option, 1);
          newProductDetail.sku = newProductDetail
            .productVariantCombinationDtos!.map(
              (p) => p.optionValueDto?.optionValueName
            )
            .toString();
          return newProductDetail;
        }
      );
    else this.mapSku();
    this.filterOptionValueSelected(
      i_option,
      this.product.optionDtos[i_option].id
    );
  }
  mapSku() {
    this.product.productDetailDtos = [];
    let sku1: any[] = [];
    let sku2: any[] = [];
    if (this.product.optionDtos.length) {
      console.log('add option');
      this.product.optionDtos[0].optionValueDtos.forEach((optionValue: any) => {
        sku1.push(optionValue);
        this.product.productDetailDtos.push({
          priceOrigin: 0,
          priceSell: 0,
          sku: optionValue.optionValueName,
          image: '',
          stock: 0,
          productVariantCombinationDtos: [
            {
              optionDto: this.product.optionDtos[0],
              optionValueDto: optionValue,
            },
          ] as ProductVariantCombinationDto[],
        });
      });
    }
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
              stock: 0,
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
  }
  current_i_product_detai_select_image = 0;
  openModalSelectImage(i_product_detail: number) {
    this.current_i_product_detai_select_image = i_product_detail;
    this.isVisibleSelectImage = true;
  }

  onSelectImage(img: string) {
    this.product.productDetailDtos[
      this.current_i_product_detai_select_image
    ].image = img;
    this.isVisibleSelectImage = false;
  }
  closeSelectedImage() {
    this.isVisibleSelectImage = false;
  }
  createOption(input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.productDetailService.createOption(value).subscribe((res: any) => {
        if (res) {
          this.options.unshift({ ...res, optionValueDtos: [] });
          input.value = '';
        }
      });
    } else {
      this.message.error('Vui lòng nhập giá trị');
    }
  }
  createOptionValue(option_id: number, input: HTMLInputElement) {
    let value = input.value;
    if (value) {
      this.productDetailService
        .createOptionValue(option_id, value)
        .subscribe((res: any) => {
          if (res) {
            let i_option = this.options.findIndex((opt) => opt.id == option_id);
            this.options[i_option].optionValueDtos.unshift(res);
            input.value = '';
          }
        });
    } else {
      this.message.error('Vui lòng nhập giá trị');
    }
  }
}
