import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeaktiverComponent } from './deaktiver.component';

describe('DeaktiverComponent', () => 
{
  let component: DeaktiverComponent;
  let fixture: ComponentFixture<DeaktiverComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      declarations: [ DeaktiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(DeaktiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
