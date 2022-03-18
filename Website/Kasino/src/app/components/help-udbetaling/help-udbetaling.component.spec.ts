import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUdbetalingComponent } from './help-udbetaling.component';

describe('HelpUdbetalingComponent', () => {
  let component: HelpUdbetalingComponent;
  let fixture: ComponentFixture<HelpUdbetalingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpUdbetalingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpUdbetalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
