import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelkomstbonusserComponent } from './velkomstbonusser.component';

describe('VelkomstbonusserComponent', () => {
  let component: VelkomstbonusserComponent;
  let fixture: ComponentFixture<VelkomstbonusserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VelkomstbonusserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VelkomstbonusserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
