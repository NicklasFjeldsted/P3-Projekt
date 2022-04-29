import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOsComponent } from './om-os.component';

describe('OmOsComponent', () => 
{
  let component: OmOsComponent;
  let fixture: ComponentFixture<OmOsComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      declarations: [ OmOsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(OmOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
