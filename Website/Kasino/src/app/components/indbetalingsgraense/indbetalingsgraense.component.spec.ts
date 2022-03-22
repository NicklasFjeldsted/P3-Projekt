import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndbetalingsgraenseComponent } from './indbetalingsgraense.component';

describe('IndbetalingsgraenseComponent', () => {
  let component: IndbetalingsgraenseComponent;
  let fixture: ComponentFixture<IndbetalingsgraenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndbetalingsgraenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndbetalingsgraenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
