import { Component, Injectable, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject } from 'src/app/game-engine';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { House, Player, ISeat } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit
{
  constructor(private authenticationService: AuthenticationService, private signalr: SignalrService) { }
 
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
    
    this.signalr.StartConnection().then(() =>
    {
      this.signalr.Subscribe("SeatsChanged", (data) => this.ReceiveSeatChanges(data));
      this.signalr.GetData("GetData");
      House.Instance._localPlayer.Connect();
    });

    for (const seat of House.Instance.seats)
    {
      seat.OnSeatJoined.subscribe((player: Player) => this.SendSeatJoined(player));
    }

    game.Load().then(() => { game.Awake(); }).catch((error) => { console.log(error); });
  }

  private SendSeatJoined(player: Player): void
  {
    this.signalr.SendData("JoinSeat", this.BuildPlayerData(player));
  }

  private ReceiveSeatChanges(seatData: string): void
  {
    House.Instance.UpdateSeats(seatData);
  }

  private BuildPlayerData(player: Player): string
  {
    return JSON.stringify(
      {
        fullName: player.gameObject.gameObjectName,
        entityID: player.gameObject.entityId,
        seatIndex: player.seat?.seatIndex
      }
    );
  }
}