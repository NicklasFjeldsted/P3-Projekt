import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlmdnextpageComponent } from './tlmdnextpage.component';

describe('TlmdnextpageComponent', () => {
  let component: TlmdnextpageComponent;
  let fixture: ComponentFixture<TlmdnextpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TlmdnextpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlmdnextpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
