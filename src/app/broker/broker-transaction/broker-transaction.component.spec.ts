import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerTransactionComponent } from './broker-transaction.component';

describe('BrokerTransactionComponent', () => {
  let component: BrokerTransactionComponent;
  let fixture: ComponentFixture<BrokerTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerTransactionComponent]
    });
    fixture = TestBed.createComponent(BrokerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
