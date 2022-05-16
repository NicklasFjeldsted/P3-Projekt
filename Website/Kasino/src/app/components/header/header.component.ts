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
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  animations: [
    trigger("openAccountPanel", [
      state(
        "true",
        style({
          right: "0",
          opacity: "1",
        })
      ),
      state(
        "false",
        style({
          right: "-15.5vh",
          opacity: ".3",
        })
      ),
      transition("open => closed", [animate("0.3s ease")]),
      transition("closed => open", [animate("0.3s ease")]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  constructor(
    public authenticationService: AuthenticationService,
    private dialog: DialogService,
    private balanceService: BalanceService,
    private customerService: CustomerService
  ) {}

  @Output() onSideNavToggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() onAccountPanelToggle: EventEmitter<void> = new EventEmitter<void>();
  @Output() onNotificationsToggle: EventEmitter<void> = new EventEmitter<void>();

  currentBalance: string;
  isLoggedIn: boolean;
  isNotificationsOpened: boolean = false;

  ngOnInit(): void {
    this.authenticationService.OnTokenChanged.subscribe((token) => {
      if (token !== "") {
        this.isLoggedIn = true;
        this.balanceService.getBalance(JwtDecodePlus.jwtDecode(token).nameid);
        this.customerService.getUser();
      } else {
        this.isLoggedIn = false;
      }
    });
    this.balanceService.OnBalanceChanged.subscribe((balance) => (this.currentBalance = balance.balance?.toLocaleString("dk", { useGrouping: true })));
  }

  emitSideNavToggle = () => this.onSideNavToggle.emit();

  emitAccountPanelToggle = () => this.onAccountPanelToggle.emit();

  emitNotificationsToggle = () => this.onNotificationsToggle.emit();

  public getBalance(): void {
    this.balanceService.OnBalanceChanged.subscribe((balance) => {
      this.currentBalance = balance.balance.toLocaleString("dk", { useGrouping: true });
    });
  }

  openDeposit = () => this.dialog.open(IndbetalComponent);

  openLogout = () => this.dialog.open(LogoutComponent);

  openNotifications = () => (this.isNotificationsOpened = true);

  closeNotifications = () => (this.isNotificationsOpened = false);
}
