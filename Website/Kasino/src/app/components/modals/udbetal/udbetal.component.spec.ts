import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdbetalComponent } from './udbetal.component';

describe('UdbetalComponent', () => {
  let component: UdbetalComponent;
  let fixture: ComponentFixture<UdbetalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdbetalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UdbetalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
