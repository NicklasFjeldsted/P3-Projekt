import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackgroundFeature, Game, GameInputFeature, GameObject, GameType, NetworkingFeature } from 'src/app/game-engine';
import { BalanceService } from 'src/app/services/balance.service';
import { CustomerService } from 'src/app/services/customer.service';
import { House } from './roulette-game';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css']
})
export class RouletteComponent implements OnInit, OnDestroy, CanDeactivate<RouletteComponent>
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
    this.game.AddFeature(new NetworkingFeature(GameType.Roulette));

    this.networking = this.game.GetFeature(NetworkingFeature);
    
    let house = new GameObject('House').AddComponent(new House()).GetComponent(House);
    this.game.Instantiate(house.gameObject);

    this.balanceService.OnBalanceChanged.subscribe((balance) => this.game.balance = balance);
    this.customerService.OnUserDataChanged.subscribe((userData) => this.game.user.Update(userData));

    this.game.Initialize().then(() =>
    {
      this.networking.Subscribe("Player_Connected", (data: string) => house.Player_Connected(data));
      this.networking.Subscribe("Player_Disconnected", (data: string) => house.Player_Disconnected(data));
      this.networking.Subscribe("Update_Server_DueTime", (data: string) => house.Update_Server_DueTime(data));
    });
  }

  public canDeactivate(
    component: RouletteComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    return component.networking.StopConnection();
  }
}
