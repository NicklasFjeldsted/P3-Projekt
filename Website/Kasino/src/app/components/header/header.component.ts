import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DialogRef } from "../modals/dialog-ref";
import { DialogService } from "../modals/dialog.service";
import { IndbetalComponent } from "../modals/indbetal/indbetal.component";
import { LogoutComponent } from "../modals/logout/logout.component";
import { Broadcast } from "./broadcast";
import { MatDialogConfig, MatDialogModule } from "@angular/material/dialog";
import { BalanceService } from "src/app/services/balance.service";
import { CustomerService } from "src/app/services/customer.service";
import { JwtDecodePlus } from "src/app/helpers";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(public authenticationService: AuthenticationService, private dialog: DialogService, private balanceService: BalanceService, private customerService: CustomerService) {}

  @Output() onSideNavToggle: EventEmitter<void> = new EventEmitter<void>();

  currentBalance: number | null;
  isLoggedIn: boolean;

  ngOnInit(): void
  {
    this.authenticationService.OnTokenChanged.subscribe((token) =>
    {
      if (token !== '')
      {
        this.isLoggedIn = true;
        this.balanceService.getBalance(JwtDecodePlus.jwtDecode(token).nameid);
        this.customerService.getUser();
      }
      else
      {
        this.isLoggedIn = false;
      }
    });
    this.balanceService.OnBalanceChanged.subscribe((balance) => (this.currentBalance = balance.balance));
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
