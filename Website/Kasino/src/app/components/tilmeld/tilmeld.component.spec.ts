import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilmeldComponent } from './tilmeld.component';

describe('TilmeldComponent', () => {
  let component: TilmeldComponent;
  let fixture: ComponentFixture<TilmeldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TilmeldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TilmeldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
