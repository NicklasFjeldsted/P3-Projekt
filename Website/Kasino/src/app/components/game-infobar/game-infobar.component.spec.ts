import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfobarComponent } from './game-infobar.component';

describe('GameInfobarComponent', () => {
  let component: GameInfobarComponent;
  let fixture: ComponentFixture<GameInfobarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameInfobarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInfobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
