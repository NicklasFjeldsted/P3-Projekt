import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { Game, Grid } from 'src/app/game-engine';
import { Fleet } from 'src/app/game-engine/fleet';
import { Team } from 'src/app/game-engine/team';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }
  
  ngOnInit(): void
  {
    const grid = new Grid();
    new Game(grid, new Fleet(Team.A, grid), new Fleet(Team.B, grid)).Awake();
  }
}
