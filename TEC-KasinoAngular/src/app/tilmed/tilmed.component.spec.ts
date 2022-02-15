import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilmedComponent } from './tilmed.component';

describe('TilmedComponent', () => {
  let component: TilmedComponent;
  let fixture: ComponentFixture<TilmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TilmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TilmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
