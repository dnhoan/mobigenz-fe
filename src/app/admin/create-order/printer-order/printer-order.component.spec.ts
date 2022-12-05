import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterOrderComponent } from './printer-order.component';

describe('PrinterOrderComponent', () => {
  let component: PrinterOrderComponent;
  let fixture: ComponentFixture<PrinterOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrinterOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
