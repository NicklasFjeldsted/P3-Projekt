import { Component, OnInit } from "@angular/core";
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
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, NgModel } from "@angular/forms";
import { BalanceService } from "src/app/services/balance.service";
import { Transaction } from "src/app/interfaces/transaction";
import { TransactionService } from "src/app/services/transaction.service";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-konto",
  templateUrl: "./konto.component.html",
  styleUrls: ["./konto.component.css"],
})
export class KontoComponent implements OnInit {
  accountInfo: AccountInfo;
  balance: Balance = new Balance();
  depositForm: FormGroup = new FormGroup({
    depositLimit: new FormControl(),
  });
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
      if(value) {
        this.kontoSite = 3;
      }
    })
    this.showAccountInfo();
    this.balanceService.OnBalanceChanged.subscribe((balance) => {
      if (balance.customerID !== undefined) {
        this.updateLocalBalance(balance);
      }
    });

    this.depositForm = this.formBuilder.group({
      depositLimit: new FormControl(1000),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.depositForm.controls;
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
    this.f["depositLimit"].patchValue(this.balance.depositLimit);
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
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Checks if user presses letters instead of digits
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Onclick function which changes users depositlimit
  updateAmount(value: number | null, addOrSub: boolean): void {
    if (addOrSub) {
      return this.f["depositLimit"].patchValue(this.f["depositLimit"].value + value);
    }
    return this.f["depositLimit"].patchValue(this.f["depositLimit"].value - value!);
  }

  // Updates users deposit limit
  updateDepositLimit(): void {
    this.balanceService.updateDeposit(this.f["depositLimit"].value).subscribe({
      next: (message) => {
        console.log(message);
        this.hasUpdateLimit = true;
        if (this.balance.depositLimit === this.f["depositLimit"].value) {
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
    this.dialog.open(IndbetalComponent)
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

