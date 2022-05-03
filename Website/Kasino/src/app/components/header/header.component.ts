import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DialogRef } from "../modals/dialog-ref";
import { DialogService } from "../modals/dialog.service";
import { IndbetalComponent } from "../modals/indbetal/indbetal.component";
import { LogoutComponent } from "../modals/logout/logout.component";
import { Broadcast } from "./broadcast";
import { MatDialogConfig, MatDialogModule } from "@angular/material/dialog";
import { BalanceService } from "src/app/services/balance.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(public authenticationService: AuthenticationService, private dialog: DialogService, private balanceService: BalanceService) {}

  @Output() onSideNavToggle: EventEmitter<void> = new EventEmitter<void>();

  currentBalance: number | null;
  isLoggedIn: boolean;

  ngOnInit(): void {
    this.authenticationService.token.subscribe((token) => {
      if (token !== "") {
        this.balanceService.getBalance();
      }
    });
    this.balanceService.getBalance();
    this.balanceService.OnBalanceChanged.subscribe((balance) => (this.currentBalance = balance.balance));
    this.authenticationService.token.subscribe((token) => (this.isLoggedIn = token !== ""));
  }

  emitSideNavToggle(): void {
    this.onSideNavToggle.emit();
  }

  public getBalance(): void {
    this.balanceService.OnBalanceChanged.subscribe((balance) => {
      this.currentBalance = balance.balance;
    });
  }

  openIndbetal() {
    this.dialog.open(IndbetalComponent);
  }

  openLogout() {
    this.dialog.open(LogoutComponent);
  }
}
