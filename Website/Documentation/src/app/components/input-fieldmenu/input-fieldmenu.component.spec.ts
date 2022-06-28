import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldmenuComponent } from './input-fieldmenu.component';

describe('InputFieldmenuComponent', () => {
  let component: InputFieldmenuComponent;
  let fixture: ComponentFixture<InputFieldmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
