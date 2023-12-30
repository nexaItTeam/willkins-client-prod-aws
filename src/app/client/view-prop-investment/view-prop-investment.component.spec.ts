import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropInvestmentComponent } from './view-prop-investment.component';

describe('ViewPropInvestmentComponent', () => {
  let component: ViewPropInvestmentComponent;
  let fixture: ComponentFixture<ViewPropInvestmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPropInvestmentComponent]
    });
    fixture = TestBed.createComponent(ViewPropInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
