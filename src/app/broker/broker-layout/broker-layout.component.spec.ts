import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerLayoutComponent } from './broker-layout.component';

describe('BrokerLayoutComponent', () => {
  let component: BrokerLayoutComponent;
  let fixture: ComponentFixture<BrokerLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerLayoutComponent]
    });
    fixture = TestBed.createComponent(BrokerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
