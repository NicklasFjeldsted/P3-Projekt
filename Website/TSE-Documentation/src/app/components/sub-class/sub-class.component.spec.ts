import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubClassComponent } from './sub-class.component';

describe('SubClassComponent', () => {
  let component: SubClassComponent;
  let fixture: ComponentFixture<SubClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
