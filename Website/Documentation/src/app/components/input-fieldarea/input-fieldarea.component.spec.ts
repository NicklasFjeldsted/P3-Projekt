import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldareaComponent } from './input-fieldarea.component';

describe('InputFieldareaComponent', () => {
  let component: InputFieldareaComponent;
  let fixture: ComponentFixture<InputFieldareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
