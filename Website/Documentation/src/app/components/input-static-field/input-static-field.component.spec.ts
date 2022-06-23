import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputStaticFieldComponent } from './input-static-field.component';

describe('InputStaticFieldComponent', () => {
  let component: InputStaticFieldComponent;
  let fixture: ComponentFixture<InputStaticFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputStaticFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputStaticFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
