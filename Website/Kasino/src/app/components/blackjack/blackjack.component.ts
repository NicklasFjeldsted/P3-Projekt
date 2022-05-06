import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {  Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, NetworkingFeature } from 'src/app/game-engine';
import { BalanceService } from 'src/app/services/balance.service';
import { CustomerService } from 'src/app/services/customer.service';
import { House, Player, PlayerData } from './blackjack-game';

@Component({
  selector: 'blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit, OnDestroy, CanDeactivate<BlackjackComponent>
{
  constructor(private balanceService: BalanceService, private customerService: CustomerService) { }

  private networking: NetworkingFeature;
  public game: Game;

  ngOnDestroy(): void
  {
    window.location.reload();
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

    this.game.Initialize().then(() =>
    {
      for (const seat of house.seats)
      {
        seat.OnSeatJoined.subscribe((data: PlayerData) => this.networking.SendData("JoinSeat", Player.BuildPlayerData(data)));
        seat.seatBet.OnBetChanged.subscribe((data: number) => this.networking.SendData("UpdateBet", data));
      }
      
      this.balanceService.OnBalanceChanged.subscribe((balance) => this.game.balance = balance);
      this.customerService.OnUserDataChanged.subscribe((userData) => this.game.user = userData);

      this.networking.Subscribe("GameEnded", () => house.GameEnded());
      this.networking.Subscribe("GameStarted", () => house.GameStarted());
      this.networking.Subscribe("UpdateBalance", () => this.balanceService.updateBalance());
      this.networking.Subscribe("UpdateSeatBet", (data: string) => house.UpdateSeatBets(data));
      
      this.networking.Subscribe("DataChanged", (data: string) => house.UpdateSeatData(data)).then(() =>
      {
        Player.OnDataChanged.subscribe((data: PlayerData) => this.networking.SendData("UpdatePlayerData", Player.BuildPlayerData(data)));
        
        house.CreateClient(this.game.user);
      });

      this.networking.Subscribe("SyncTurn", (data: string) => house.SyncTurn(data));
      this.networking.Subscribe("SyncPlaying", (data: string) => house.SyncPlaying(data));

      this.networking.Subscribe("HouseCards", (data: string) => house.HouseCards(data));
    });
  }

  public canDeactivate(
    component: BlackjackComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    return component.networking.StopConnection();
  }
}