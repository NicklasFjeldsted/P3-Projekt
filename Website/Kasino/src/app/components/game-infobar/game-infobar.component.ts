import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Balance } from "src/app/interfaces/balance";
import { UserData } from "src/app/interfaces/User";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BalanceService } from "src/app/services/balance.service";
import { CustomerService } from "src/app/services/customer.service";

@Component({
  selector: "app-game-infobar",
  templateUrl: "./game-infobar.component.html",
  styleUrls: ["./game-infobar.component.css"],
})
export class GameInfobarComponent implements OnInit {
  constructor(private balanceService: BalanceService, private customerService: CustomerService)
  {
    this.startTime = Date.now();
    setInterval(() => {
      this.time = Date.now();
      this.timePlayed = this.convertMStoTime(this.time - this.startTime);
    }, 1);
  }

  public user: UserData;
  public balance: Balance;
  public time: number = Date.now();
  private startTime: number;
  public timePlayed: string;

  private padTo2Digits(num: number): string
  {
    return num.toString().padStart(2, '0');
  }

  private convertMStoTime(milliseconds: number): string
  {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}`;
  }

  ngOnInit(): void
  {
    this.balanceService.OnBalanceChanged.subscribe((balance) => this.balance = balance);
    this.customerService.OnUserDataChanged.subscribe((userData) => this.user = userData);
  }
}
