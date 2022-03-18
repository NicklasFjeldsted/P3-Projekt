import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { Game, GameObject, Vector3 } from 'src/app/game-engine';
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

    let testGO: GameObject = new GameObject("Hello World!");

    testGO.AddComponent(new SpriteRendererComponent('../../../assets/media/cards.png'));
    testGO.transform.scale = new Vector3(0.25, 0.25, 0);





    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}
