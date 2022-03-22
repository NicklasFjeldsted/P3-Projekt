import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AccountInfo } from 'src/app/interfaces/accountInfo';
import { Balance } from 'src/app/interfaces/balance';


@Component({
  selector: 'app-konto',
  templateUrl: './konto.component.html',
  styleUrls: ['./konto.component.css']
})
export class KontoComponent implements OnInit {

  accountInfo: AccountInfo;
  currentBalance: number | null;

  constructor(public customerService: CustomerService, public authenticationService: AuthenticationService) {
    this.accountInfo = {
      phoneNumber: 0,
      firstName: '',
      lastName: '',
      address: ''
    };
  }

  // constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.showAccountInfo();
    this.getBalance();
  }


  private showAccountInfo(): void {
    this.authenticationService.getAccount().subscribe({
      next: (userInfo) => {
        this.accountInfo = Object.assign(userInfo);
        console.log(this.accountInfo);
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


}
