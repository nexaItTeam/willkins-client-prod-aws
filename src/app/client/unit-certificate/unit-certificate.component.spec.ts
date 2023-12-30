import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCertificateComponent } from './unit-certificate.component';

describe('UnitCertificateComponent', () => {
  let component: UnitCertificateComponent;
  let fixture: ComponentFixture<UnitCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitCertificateComponent]
    });
    fixture = TestBed.createComponent(UnitCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
