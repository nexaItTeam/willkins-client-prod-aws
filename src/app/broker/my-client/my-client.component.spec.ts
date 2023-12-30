import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClientComponent } from './my-client.component';

describe('MyClientComponent', () => {
  let component: MyClientComponent;
  let fixture: ComponentFixture<MyClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyClientComponent]
    });
    fixture = TestBed.createComponent(MyClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
