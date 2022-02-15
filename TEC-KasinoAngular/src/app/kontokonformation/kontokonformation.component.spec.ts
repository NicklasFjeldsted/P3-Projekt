import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontokonformationComponent } from './kontokonformation.component';

describe('KontokonformationComponent', () => {
  let component: KontokonformationComponent;
  let fixture: ComponentFixture<KontokonformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KontokonformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KontokonformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
