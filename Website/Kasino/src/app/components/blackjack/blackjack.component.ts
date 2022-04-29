import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, IBeforeUnload, NetworkingFeature, ShapeRendererComponent, Vector2 } from 'src/app/game-engine';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { House, Player, PlayerData } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit, OnDestroy, CanDeactivate<BlackjackComponent>
{
  constructor(private http: HttpClient)
  { 

  }

  private networking: NetworkingFeature;
  private game: Game;

  ngOnDestroy(): void
  {
    window.location.reload();
    //this.game.Dispose().then(() => console.warn("GAME - Disposed"));
  }

  ngOnInit(): void
  {
    this.game = new Game();
    
    this.game.AddFeature(new BackgroundFeature());
    this.game.AddFeature(new GameInputFeature());
    this.game.AddFeature(new NetworkingFeature());

    this.networking = this.game.GetFeature(NetworkingFeature);

    let house = new GameObject('House').AddComponent(new House()).GetComponent(House);
    this.game.Instantiate(house.gameObject);

    this.game.BEGIN_GAME().then(() =>
    {
      for (const seat of house.seats)
      {
        seat.OnSeatJoined.subscribe((data: PlayerData) => this.networking.SendData("JoinSeat", Player.BuildPlayerData(data)));
      }

      this.networking.Subscribe("GameEnded", () => house.GameEnded());
      this.networking.Subscribe("GameStarted", () => house.GameStarted());
      
      this.networking.Subscribe("DataChanged", (data) => house.UpdateSeatData(data)).then(() =>
      {
        Player.OnDataChanged.subscribe((data: PlayerData) => this.networking.SendData("UpdatePlayerData", Player.BuildPlayerData(data)));

        this.GetUser().subscribe((user) => house.CreateClient(user));
      });
      
      this.networking.Subscribe("SyncTurn", (data) => house.SyncTurn(data));
      this.networking.Subscribe("SyncPlaying", (data) => house.SyncPlaying(data));

      this.networking.Subscribe("HouseCards", (data) => house.HouseCards(data));
    });
  }

  public GetUser(): Observable<IUser>
  {
    return this.http.get<IUser>(environment.apiURL + "/blackjack/GetUser");
  }

  public canDeactivate(
    component: BlackjackComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    component.networking.Unsubscribe('JoinSeat');
    component.networking.Unsubscribe('DataChanged');
    component.networking.Unsubscribe('UpdatePlayerData');
    component.networking.Unsubscribe('SyncTurn');
    component.networking.Unsubscribe('SyncPlaying');
    component.networking.Unsubscribe('GameEnded');
    component.networking.Unsubscribe('GameStarted');
    component.networking.Unsubscribe('HouseCards');
    return component.networking.StopConnection();
  }
}