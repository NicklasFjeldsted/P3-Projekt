import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, IBeforeUnload, NetworkingFeature } from 'src/app/game-engine';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { House, Player, PlayerData } from './blackjack-game';

@Component({
  selector: 'game',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit, OnDestroy
{
  constructor(private http: HttpClient)
  { 

  }

  private networking: NetworkingFeature;
  private game: Game;

  ngOnDestroy(): void
  {
    console.warn('GAME - Disposed');
    this.game.END_GAME().then(() =>
    {
		  console.log(this.game);
    });
  }

  ngOnInit(): void
  {
    this.game = Game.Instance;
    
    this.game.AddFeature(new BackgroundFeature());
    this.game.AddFeature(new GameInputFeature());
    this.game.AddFeature(new NetworkingFeature());

    this.networking = this.game.GetFeature(NetworkingFeature);

    new GameObject('House').AddComponent(House.Instance);

    for (const seat of House.Instance.seats)
    {
      seat.OnSeatJoined.subscribe((data: PlayerData) => this.networking.SendData("JoinSeat", Player.BuildPlayerData(data)));
    }

    this.game.BEGIN_GAME().then(() =>
    {
      this.networking.Subscribe("DataChanged", (data) => House.Instance.UpdateSeatData(data)).then(() =>
      {
        Player.OnDataChanged.subscribe((data: PlayerData) => this.networking.SendData("UpdatePlayerData", Player.BuildPlayerData(data)));

        this.GetUser().subscribe((user) => House.Instance.CreateClient(user));
      });
      
      this.networking.Subscribe("SyncTurn", (data) => House.Instance.SyncTurn(data));
      this.networking.Subscribe("SyncPlaying", (data) => House.Instance.SyncPlaying(data));

      this.networking.Subscribe("HouseCards", (data) => House.Instance.HouseCards(data));

      console.log(this.game);
    });
  }

  public GetUser(): Observable<IUser>
  {
    return this.http.get<IUser>(environment.apiURL + "/blackjack/GetUser");
  }

  // public canDeactivate(
  //   component: BlackjackComponent,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot
  // ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  // {
  //   return component.networking.KILL();
  // }
}