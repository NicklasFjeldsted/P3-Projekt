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

    const player1: GameObject = new GameObject('Player1');
    const player2: GameObject = new GameObject('Player2');
    const house: GameObject = new GameObject('House');

    house.AddComponent(House.Instance);

    player1.AddComponent(new Player());
    player1.transform.position = new Vector3(20, 550, 0);
    player1.AddComponent(new ColliderComponent());
    player1.AddComponent(new TextComponent('@playerCards1'));

    player2.AddComponent(new Player());
    player2.transform.position = new Vector3(300, 550, 0);
    player2.AddComponent(new ColliderComponent());
    player2.AddComponent(new TextComponent('@playerCards2'));

    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}