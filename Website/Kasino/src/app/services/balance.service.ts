import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeBalance } from '../interfaces/changeBalance';

const USER = 'USER_ID';
@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  balance: ChangeBalance;
  constructor(private http: HttpClient) { }

  public addBalance(money: number): Observable<any> {
    var id = JSON.parse(localStorage.getItem(USER)!);
    this.balance = {customerID: id, amount: money};
    return this.http.put<any>(`${environment.apiURL}/balance/add-balance`, this.balance, {withCredentials: true});
  }

  public subtractBalance(money: number): Observable<any> {
    var id = JSON.parse(localStorage.getItem(USER)!);
    this.balance = {customerID: id, amount: money};
    return this.http.put<any>(`${environment.apiURL}/balance/subtract-balance`, this.balance, {withCredentials: true})
  }

  public updateDeposit(depositLimit: number): Observable<any> {
    var customerID = JSON.parse(localStorage.getItem(USER)!);
    return this.http.put<any>(`${environment.apiURL}/balance/update`, {customerID, depositLimit}, {withCredentials: true})
  }
}
