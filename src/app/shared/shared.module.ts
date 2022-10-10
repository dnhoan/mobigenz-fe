import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgZorroAntdModule } from './ng-zorro-antd.module';

registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    NgZorroAntdModule,
    IconsProviderModule,
    NzLayoutModule,
    ReactiveFormsModule,
    NzMenuModule,
  ],
  exports: [
    FormsModule,
    NgZorroAntdModule,
    IconsProviderModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  providers: [
    DatePipe,
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_I18N, useValue: vi_VN },
  ],
})
export class SharedModule {}
