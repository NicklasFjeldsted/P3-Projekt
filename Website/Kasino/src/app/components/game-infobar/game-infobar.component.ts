import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Balance } from 'src/app/interfaces/balance';
import { UserData } from 'src/app/interfaces/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BalanceService } from 'src/app/services/balance.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-game-infobar',
  templateUrl: './game-infobar.component.html',
  styleUrls: ['./game-infobar.component.css']
})
export class GameInfobarComponent implements OnInit {

  constructor(private balanceService: BalanceService, private customerService: CustomerService, private authenticationService: AuthenticationService)
  {
    setInterval(() => { this.time = Date.now(); }, 1);
  }

  @Output() OnBalanceChanged: EventEmitter<Balance> = new EventEmitter<Balance>();
  @Output() OnUserChanged: EventEmitter<UserData> = new EventEmitter<UserData>();
  
  public user: UserData;
  public balance: Balance;
  public time: number = Date.now();

  ngOnInit(): void
  {
    this.getBalance();
    this.getUser();
  }

  public getBalance(): void
  {
    this.balanceService.getBalance().subscribe({
      next: (userBalance) =>
      {
        this.OnBalanceChanged.emit(userBalance);
        this.balance = userBalance;
      },
      error: (error) =>
      {
        console.error(error);
      }
    });
  }

  public getUser(): void
  {
    this.customerService.getUser().subscribe({
      next: (user) =>
      {
        this.OnUserChanged.emit(user);
        this.user = user;
      },
      error: (error) =>
      {
        console.error(error);
      }
    });
  }

}
