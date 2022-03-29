import { Component, Injectable, OnInit } from '@angular/core';
import { BackgroundFeature, Game, GameInputFeature, GameObject, NetworkingFeature } from 'src/app/game-engine';
import { AuthenticationGuard } from 'src/app/services/authentication-guard.service';
import { House, Player, PlayerData } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit
{
  constructor(private authenticationGuard: AuthenticationGuard) { }
 
  private networking: NetworkingFeature;

  ngOnInit(): void
  {
    const game: Game = Game.Instance;
    
    game.AddFeature(new BackgroundFeature());
    game.AddFeature(new GameInputFeature());
    game.AddFeature(new NetworkingFeature());

    this.networking = game.GetFeature(NetworkingFeature);

    const house: GameObject = new GameObject('House');
    house.AddComponent(House.Instance);

    for (const seat of House.Instance.seats)
    {
      seat.OnSeatJoined.subscribe((player: PlayerData) => this.networking.SendData("JoinSeat", Player.BuildPlayerData(player)));
    }

    game.BEGIN_GAME().then(() =>
    {
      this.networking.Subscribe("SeatsChanged", (data) => House.Instance.UpdateSeats(data)).then(() =>
      {
        this.networking.GetData("GetData");
      });

      this.networking.Subscribe("SyncTurn", (data) => House.Instance.SyncTurn(data));
      this.networking.Subscribe("SyncPlaying", (data) => House.Instance.SyncPlaying(data));

      this.networking.Subscribe("HouseCards", (data) => House.Instance.HouseCards(data));
    });
  }
}