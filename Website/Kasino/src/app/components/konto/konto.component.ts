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


@Component({
  selector: 'app-konto',
  templateUrl: './konto.component.html',
  styleUrls: ['./konto.component.css']
})
export class KontoComponent implements OnInit {

  accountInfo: AccountInfo;
  currentBalance: number | null;

  constructor(public customerService: CustomerService, public authenticationService: AuthenticationService, private dialog: DialogService) {
    this.accountInfo = {
      phoneNumber: 0,
      firstName: '',
      lastName: '',
      address: ''
    };
  }

  ngOnInit(): void {
    this.showAccountInfo();
    this.getBalance();
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
      },
      error: (error) => {
        console.log(error)
      }
    })
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
}
