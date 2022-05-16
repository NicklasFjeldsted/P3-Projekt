import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {  Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, GameType, NetworkingFeature } from 'src/app/game-engine';
import { BalanceService } from 'src/app/services/balance.service';
import { CustomerService } from 'src/app/services/customer.service';
import { House, Player, BlackjackPlayerData } from './blackjack-game';

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
    this.game.AddFeature(new NetworkingFeature(GameType.Blackjack));

    this.networking = this.game.GetFeature(NetworkingFeature);

    let house = new GameObject('House').AddComponent(new House()).GetComponent(House);
    this.game.Instantiate(house.gameObject);

    this.balanceService.OnBalanceChanged.subscribe((balance) => this.game.balance = balance);
    this.customerService.OnUserDataChanged.subscribe((userData) => this.game.user = userData);

    this.game.Initialize().then(() =>
    {
      for (const seat of house.seats)
      {
        seat.seatBet.OnBetChanged.subscribe((data: number) => this.networking.SendData("UpdateBet", data));
        seat.OnSeatJoined.subscribe((data: BlackjackPlayerData) => this.networking.SendData("Update_PlayerData", Player.BuildPlayerData(data)));
      }

      this.networking.Subscribe("Update_PlayerData_Callback", (data: string) => house.Update_PlayerData_Callback(data)); // Changed data from others.
      this.networking.Subscribe("Get_PlayerData_Callback", (data: string) => house.Get_PlayerData_Callback(data)); // Current server data (ConnectedPlayers<Dictionary>).

      this.networking.Subscribe("Player_Connected", (data: string) => house.Player_Connected(data)); // ConnectionID of the player who joined.
      this.networking.Subscribe("Player_Disconnected", (data: string) => house.Player_Disconnected(data)); // Data of the player who left.

      this.networking.Subscribe("Game_Ended", () => house.GameEnded());
      this.networking.Subscribe("Game_Started", () => house.GameStarted());
      this.networking.Subscribe("Update_Server_DueTime", (timeLeft: string) => house.Update_Server_DueTime(timeLeft));
      this.networking.Subscribe("Update_Balance", () => this.balanceService.updateBalance());
      this.networking.Subscribe("Update_HouseCards_Callback", (data: string) => house.HouseCards(data));
      this.networking.Subscribe("Sync_PlayerBet", (data: string) => house.UpdateSeatBets(data));
      this.networking.Subscribe("Sync_CurrentTurn", (data: string) => house.SyncTurn(data));
      this.networking.Subscribe("Sync_CurrentStage", (data: string) => house.SyncPlaying(data));
      
      house.CreateClient(this.game.user);
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