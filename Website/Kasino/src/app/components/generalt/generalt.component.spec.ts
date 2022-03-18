import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraltComponent } from './generalt.component';

describe('GeneraltComponent', () => {
  let component: GeneraltComponent;
  let fixture: ComponentFixture<GeneraltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneraltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneraltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
