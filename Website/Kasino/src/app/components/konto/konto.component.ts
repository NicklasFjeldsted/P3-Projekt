import { Component, OnInit, AfterViewInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CustomerService } from "../../services/customer.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AccountInfo } from "src/app/interfaces/accountInfo";
import { Balance } from "src/app/interfaces/balance";
import { IndbetalComponent } from "../modals/indbetal/indbetal.component";
import { UdbetalComponent } from "../modals/udbetal/udbetal.component";
import { DialogService } from "../modals/dialog.service";
import { LogoutComponent } from "../modals/logout/logout.component";
import { DeaktiverComponent } from "../modals/deaktiver/deaktiver.component";
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, NgModel, Validators } from "@angular/forms";
import { BalanceService } from "src/app/services/balance.service";
import { Transaction } from "src/app/interfaces/transaction";
import { TransactionService } from "src/app/services/transaction.service";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-konto",
  templateUrl: "./konto.component.html",
  styleUrls: ["./konto.component.css"],
})
export class KontoComponent implements OnInit, AfterViewInit {
  accountInfo: AccountInfo;
  balance: Balance = new Balance();
  depositLimit: FormControl;
  kontoSite: number = 1;

  transactionList: Transaction[] = [];
  hasUpdateLimit: boolean = false;

  constructor(
    public customerService: CustomerService,
    private transaction: TransactionService,
    public authenticationService: AuthenticationService,
    public balanceService: BalanceService,
    private dialog: DialogService,
    private formBuilder: FormBuilder
  ) {
    this.accountInfo = {
      email: "",
      phoneNumber: 0,
      firstName: "",
      lastName: "",
      address: "",
    };
  }

  ngOnInit(): void {
    this.kontoSite = 1;
    this.balanceService.OnIndbetalingChange.subscribe((value) => {
      this.kontoSite = value;
    });
    this.depositLimit = new FormControl(1000, [Validators.max(100000), Validators.min(1000)]);
    this.balanceService.OnBalanceChanged.subscribe((balance) => {
      if (balance.customerID !== undefined) {
        this.updateLocalBalance(balance);
      }
    });
  }

  ngAfterViewInit(): void {
    this.showAccountInfo();
  }

  // Gets userdata from API Call
  private showAccountInfo(): void {
    this.authenticationService.getAccount().subscribe({
      next: (userInfo) => {
        this.accountInfo = Object.assign(userInfo);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Gets user information from token and decrypts the data
  updateLocalBalance(newBalance: Balance): void {
    this.balance = newBalance;
    this.depositLimit.patchValue(this.balance.depositLimit);
    this.updateLocalTransactions(newBalance.customerID);
  }

  // API call for transactions on a given id, which data response is put in a array
  updateLocalTransactions(id: number): void {
    this.transaction.getAllById(id).subscribe({
      next: (transactions) => {
        this.transactionList = [];
        transactions.forEach((element) => {
          this.transactionList.push(element);
        });
      },
    });
  }

  // Checks if user presses letters instead of digits
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;

    if (this.depositLimit.value >= 100000) {
      this.depositLimit.patchValue(100000);
    }
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Onclick functions which changes users depositlimit
  addAmount = () => this.depositLimit.patchValue(this.depositLimit.value + 25);
  subAmount = () => this.depositLimit.patchValue(this.depositLimit.value - 25);

  // Updates users deposit limit
  updateDepositLimit(): void {
    this.balanceService.updateDeposit(this.depositLimit.value).subscribe({
      next: (message) => {
        console.log(message);
        this.hasUpdateLimit = true;
        if (this.balance.depositLimit == this.depositLimit.value) {
          alert("Du har ikke ændret din indbetalingsgrænse");
        } else {
          console.log(message);
          alert("Din indbetalingsgrænse er blevet opdateret");
          window.location.reload();
        }
      },
      error: (error) => {
        console.log("error" + error);
      },
    });
  }

  // Onclick function which changes the site
  changeSite(site: number) {
    this.kontoSite = site;
  }

  // Onclick function which opens a component
  openIndbetal() {
    this.dialog.open(IndbetalComponent);
  }

  // Onclick function which opens a component
  openUdbetal() {
    this.dialog.open(UdbetalComponent);
  }

  // Onclick function which opens a component
  openLogout() {
    this.dialog.open(LogoutComponent);
  }

  // Onclick function which opens a component
  openDeaktiver() {
    this.dialog.open(DeaktiverComponent);
  }
}
