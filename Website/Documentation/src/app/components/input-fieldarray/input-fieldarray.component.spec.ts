import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldarrayComponent } from './input-fieldarray.component';

describe('InputFieldarrayComponent', () => {
  let component: InputFieldarrayComponent;
  let fixture: ComponentFixture<InputFieldarrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldarrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
