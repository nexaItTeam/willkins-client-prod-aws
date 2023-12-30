import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProjectComponent } from './buy-project.component';

describe('BuyProjectComponent', () => {
  let component: BuyProjectComponent;
  let fixture: ComponentFixture<BuyProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyProjectComponent]
    });
    fixture = TestBed.createComponent(BuyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
