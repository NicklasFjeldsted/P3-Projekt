import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, NetworkingFeature } from 'src/app/game-engine';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { House, Player, PlayerData } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit
{
  constructor(private http: HttpClient) { }
 
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
      seat.OnSeatJoined.subscribe((data: PlayerData) => this.networking.SendData("JoinSeat", Player.BuildPlayerData(data)));
    }

    game.BEGIN_GAME().then(() =>
    {
      this.networking.Subscribe("Debug", (data) => { console.log("--DEBUG--"); console.log(JSON.parse(data)); console.log("--DEBUG--"); });

      this.networking.Subscribe("DataChanged", (data) => House.Instance.UpdateSeatData(data)).then(() =>
      {
        Player.OnDataChanged.subscribe((data: PlayerData) => this.networking.SendData("UpdatePlayerData", Player.BuildPlayerData(data)));

        this.GetUser().subscribe((user) => House.Instance.CreateClient(user));
      });
      
      this.networking.Subscribe("SyncTurn", (data) => House.Instance.SyncTurn(data));
      this.networking.Subscribe("SyncPlaying", (data) => House.Instance.SyncPlaying(data));

      this.networking.Subscribe("HouseCards", (data) => House.Instance.HouseCards(data));
    });
  }

  public GetUser(): Observable<IUser>
  {
    return this.http.get<IUser>(environment.apiURL + "/blackjack/GetUser");
  }
}