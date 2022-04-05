import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AccountInfo } from 'src/app/interfaces/accountInfo';
import { Balance } from 'src/app/interfaces/balance';
import { IndbetalComponent } from '../modals/indbetal/indbetal.component';
import { UdbetalComponent } from '../modals/udbetal/udbetal.component';
import { DialogService } from '../modals/dialog.service';
import { LogoutComponent } from '../modals/logout/logout.component';
import { DeaktiverComponent } from '../modals/deaktiver/deaktiver.component';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { BalanceService } from 'src/app/services/balance.service';


@Component({
  selector: 'app-konto',
  templateUrl: './konto.component.html',
  styleUrls: ['./konto.component.css']
})
export class KontoComponent implements OnInit {

  accountInfo: AccountInfo;
  currentBalance: number | null;
  currentLimit: number | null;
  accountId: number | null;
  depositForm: FormGroup = new FormGroup({
    depositLimit: new FormControl()
  });

  kontoSite: number = 1;

  constructor(public customerService: CustomerService, public authenticationService: AuthenticationService, public balanceService: BalanceService, private dialog: DialogService, private formBuilder: FormBuilder) {
    this.accountInfo = {
      email: '',
      phoneNumber: 0,
      firstName: '',
      lastName: '',
      address: ''
    };
  }

  ngOnInit(): void {
    this.showAccountInfo();
    this.getBalance();

    this.depositForm = this.formBuilder.group({
      depositLimit: new FormControl(2500)
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.depositForm.controls;
  }


  private showAccountInfo(): void {
    this.authenticationService.getAccount().subscribe({
      next: (userInfo) => {
        this.accountInfo = Object.assign(userInfo);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getBalance(): void {
    this.authenticationService.decodeToken().subscribe({
      next: (userBalance) => {
        this.currentBalance = userBalance.balance;
        this.accountId = userBalance.customerID;
        this.currentLimit = userBalance.depositLimit;
        this.f['depositLimit'].patchValue(userBalance.depositLimit);
      },
      error: (error) => {
        console.log(error)
      }})
  }

  // Checks if user presses letters instead of digits
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  updateAmount(value: number | null, addOrSub: boolean): void {
    if(addOrSub) {
      return this.f['depositLimit'].patchValue(this.f['depositLimit'].value + value);
    }
    return this.f['depositLimit'].patchValue(this.f['depositLimit'].value - value!);
  }

  updateDepositLimit(): void {
    this.balanceService.updateDeposit(this.f['depositLimit'].value).subscribe({
      next: (message) => {
        console.log(message);
      },
      error: (error) => {
        console.log('error' + error);
      }
    })
  }


  changeSite(site: number) {
    this.kontoSite = site;
  }

  openIndbetal() {
    this.dialog.open(IndbetalComponent);
  }

  openUdbetal() {
    this.dialog.open(UdbetalComponent);
  }

  openLogout() {
    this.dialog.open(LogoutComponent);
  }

  openDeaktiver() {
    this.dialog.open(DeaktiverComponent);
  }
}
