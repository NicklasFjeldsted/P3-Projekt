import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndstillingerComponent } from './indstillinger.component';

describe('IndstillingerComponent', () => 
{
  let component: IndstillingerComponent;
  let fixture: ComponentFixture<IndstillingerComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      declarations: [ IndstillingerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(IndstillingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
