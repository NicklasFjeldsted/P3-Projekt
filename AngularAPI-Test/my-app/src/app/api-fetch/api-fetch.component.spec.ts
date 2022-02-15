import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APIFetchComponent } from './api-fetch.component';

describe('APIFetchComponent', () => {
  let component: APIFetchComponent;
  let fixture: ComponentFixture<APIFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ APIFetchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(APIFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
