import { Component, Injectable, OnInit } from '@angular/core';
import { BackgroundFeature, TextComponent, Game, GameInputFeature, GameObject, Vector3, ColliderComponent } from 'src/app/game-engine';
import { House, Player } from './blackjack-game';

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
    const game: Game = Game.Instance;

    game.AddFeature(new BackgroundFeature());
    game.AddFeature(new GameInputFeature());

    const player: GameObject = new GameObject('Player');
    const house: GameObject = new GameObject('House');

    house.AddComponent(House.Instance);

    player.AddComponent(new Player());
    player.AddComponent(new ColliderComponent());
    player.AddComponent(new TextComponent('@playerCards'));
    player.transform.position = new Vector3(20, 550, 0);

    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}