import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService } from "./components/modals/dialog.service";
import { LogoutComponent } from "./components/modals/logout/logout.component";
import { JwtDecodePlus } from "./helpers";
import { AuthenticationService } from "./services/authentication.service";
import { BalanceService } from "./services/balance.service";

@Component({
  selector: "app-root",
  animations: [
    trigger("openSidenav", [
      state(
        "open",
        style({
          left: "0",
          opacity: "1",
        })
      ),
      state(
        "closed",
        style({
          left: "-250px",
          opacity: ".3",
        })
      ),
      transition("open => closed", [animate("0.3s ease")]),
      transition("closed => open", [animate("0.3s ease")]),
    ]),
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
          right: "-340px",
          opacity: ".3",
        })
      ),
      transition("true => false", [animate("0.3s ease")]),
      transition("false => true", [animate("0.3s ease")]),
    ]),
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private balanceService: BalanceService,
    private dialog: DialogService
  ) {}

  isIndbetalOpen = false;

  role: string = "";

  accountName: string = "";
  accountID: number = 0;
  accountBalance: string = "";

  isAccountPanel: boolean = false;
  isSidenavOpen: boolean = false;
  isNotificationsOpened: boolean = false;

  sideNav: HTMLElement;
  accountPanel: HTMLElement;
  backDrop: HTMLElement;

  hasVisited = false;

  ngOnInit(): void 
  {
    this.sideNav = document.getElementById("sideNav")!;
    this.backDrop = document.getElementById("backdrop")!;
    this.accountPanel = document.getElementById("account-panel")!;
    this.authenticationService.OnTokenChanged.subscribe((token) => 
    {
      let role = "";
      if (token !== "") 
      {
        role = JwtDecodePlus.jwtDecode(token).role;
        this.accountName = JwtDecodePlus.jwtDecode(token).given_name;
        this.accountID = JwtDecodePlus.jwtDecode(token).nameid;
      }
      this.role = role;
    });
    this.balanceService.OnBalanceChanged.subscribe((balance) => 
    {
      if (balance.customerID !== undefined) 
      {
        this.accountBalance = balance.balance.toLocaleString("dk", { useGrouping: true });
      }
    });
  }

  closeSideNav(): void {
    if (this.sideNav.classList.contains("active")) 
    {
      this.isSidenavOpen = !this.isSidenavOpen;
      this.sideNav.classList.remove("active");
      this.backDrop.classList.remove("active");
    }
  }

  openSideNav(): void 
  {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sideNav.classList.add("active");
    this.backDrop.classList.add("active");
  }

  closeAccountPanel(): void 
  {
    if (this.accountPanel.classList.contains("active")) {
      this.isAccountPanel = !this.isAccountPanel;
      this.backDrop.classList.remove("active");
      this.accountPanel.classList.remove("active");
    }
  }

  openAccountPanel(): void 
  {
    this.isAccountPanel = !this.isAccountPanel;
    this.backDrop.classList.add("active");
    this.accountPanel.classList.add("active");
  }

  openNotifications() 
  {
    this.isNotificationsOpened = true;
    document.getElementById("backdrop")?.classList.add("back-drop-notifications");
  }

  closeNotifications() 
  {
    this.isNotificationsOpened = false;
    document.getElementById("backdrop")?.classList.remove("back-drop-notifications");
  }

  goToLink(site: string) 
  {
    this.router.navigate([site]);
  }

  goToAccount(number: number): void 
  {
    this.closeAccountPanel();
    if (this.router.url != "/konto") 
    {
      this.router.navigate(["konto"]);
    }
    this.balanceService.goToLimit(number);
  }

  openLogout() 
  {
    this.closeAccountPanel();
    this.dialog.open(LogoutComponent);
  }
}
