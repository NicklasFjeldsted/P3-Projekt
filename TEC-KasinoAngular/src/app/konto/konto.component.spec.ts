import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontoComponent } from './konto.component';

describe('KontoComponent', () => {
  let component: KontoComponent;
  let fixture: ComponentFixture<KontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KontoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
