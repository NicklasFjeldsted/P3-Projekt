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
  constructor(private balanceService: BalanceService, private customerService: CustomerService) {
    setInterval(() => {
      this.time = Date.now();
    }, 1);
  }

  public user: UserData;
  public balance: Balance;
  public time: number = Date.now();

  ngOnInit(): void
  {
    this.balanceService.OnBalanceChanged.subscribe((balance) => this.balance = balance);
    this.customerService.OnUserDataChanged.subscribe((userData) => this.user = userData);
  }
}
