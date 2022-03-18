import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { Game, GameObject, MonoBehaviour, Vector3 } from 'src/app/game-engine';
import { SpriteRendererComponent } from 'src/app/game-engine/game/components/draw';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void
  {
    const game = Game.Instance;
    const player: GameObject = new GameObject('House');
    const house: GameObject = new GameObject('Player');




    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}
