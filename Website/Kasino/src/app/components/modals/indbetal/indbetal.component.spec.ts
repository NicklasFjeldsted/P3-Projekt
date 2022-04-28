import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndbetalComponent } from './indbetal.component';

describe('IndbetalComponent', () => 
{
  let component: IndbetalComponent;
  let fixture: ComponentFixture<IndbetalComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      declarations: [ IndbetalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(IndbetalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
