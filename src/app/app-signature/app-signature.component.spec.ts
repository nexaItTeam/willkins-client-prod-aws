import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSignatureComponent } from './app-signature.component';

describe('AppSignatureComponent', () => {
  let component: AppSignatureComponent;
  let fixture: ComponentFixture<AppSignatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppSignatureComponent]
    });
    fixture = TestBed.createComponent(AppSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
