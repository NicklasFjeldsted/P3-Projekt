import { Component, Injectable, OnInit } from '@angular/core';
import { Game, GameObject, Vector3 } from 'src/app/game-engine';
import { BackgroundFeature, SpriteRendererComponent, TextComponent } from 'src/app/game-engine/game/components/draw';
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
    const game = Game.Instance;

    game.AddFeature(new BackgroundFeature());

    const player: GameObject = new GameObject('Player');
    const house: GameObject = new GameObject('House');
    house.AddComponent(House.Instance);
    player.AddComponent(new Player());
    player.AddComponent(new TextComponent('@playerCards'));
    player.transform.position = new Vector3(20, 550, 0);
    GameObject.FindOfType(Player);



    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}
