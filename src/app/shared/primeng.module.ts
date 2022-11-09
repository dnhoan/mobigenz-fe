import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
@NgModule({
  exports: [ButtonModule, EditorModule],
})
export class PrimeNgModule {}
