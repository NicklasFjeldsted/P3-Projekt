import { Component, Injectable, OnInit } from '@angular/core';
import { BackgroundFeature, TextComponent, Game, GameInputFeature, GameObject, Vector3, ColliderComponent } from 'src/app/game-engine';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { House, Player } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }
  
  ngOnInit(): void
  {
    const game: Game = Game.Instance;

    game.AddFeature(new BackgroundFeature());
    game.AddFeature(new GameInputFeature());

    const local_player: GameObject = new GameObject('TempName Local Player 1');
    local_player.AddComponent(new Player());
    
    const house: GameObject = new GameObject('House');
    
    house.AddComponent(House.Instance);

    house.GetComponent(House)._localPlayer = local_player.GetComponent(Player);
    

    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }
}