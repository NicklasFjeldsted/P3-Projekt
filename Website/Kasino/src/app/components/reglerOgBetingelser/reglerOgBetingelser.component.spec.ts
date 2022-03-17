import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglerOgBetingelserComponent } from './reglerOgBetingelser.component';

describe('ReglerOgBetingelserComponent', () => {
  let component: ReglerOgBetingelserComponent;
  let fixture: ComponentFixture<ReglerOgBetingelserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglerOgBetingelserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglerOgBetingelserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});