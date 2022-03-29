import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpIndbetalingComponent } from './help-indbetaling.component';

describe('HelpIndbetalingComponent', () => {
  let component: HelpIndbetalingComponent;
  let fixture: ComponentFixture<HelpIndbetalingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpIndbetalingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpIndbetalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
