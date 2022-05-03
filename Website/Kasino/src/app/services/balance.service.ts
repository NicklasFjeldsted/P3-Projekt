import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeBalance } from '../interfaces/changeBalance';
import { Balance } from '../interfaces/balance';

@Injectable({
  providedIn: 'root'
})
export class BalanceService 
{
  balance: ChangeBalance;
  constructor(private http: HttpClient) { }

  id: number = JSON.parse(localStorage.getItem(environment.USER_ID)!);

  public addBalance(money: number): Observable<any> 
  {
    this.balance = { customerID: this.id, amount: money };
    return this.http.put<any>(`${environment.apiURL}/balance/add-balance`, this.balance, {withCredentials: true});
  }

  public subtractBalance(money: number): Observable<any> 
  {
    this.balance = { customerID: this.id, amount: money };
    return this.http.put<any>(`${environment.apiURL}/balance/subtract-balance`, this.balance, {withCredentials: true})
  }

  public updateDeposit(depositLimit: number): Observable<any> 
  {
    let customerID = this.id;
    return this.http.put<any>(`${environment.apiURL}/balance/update`, {customerID, depositLimit}, {withCredentials: true})
  }

  public getBalance(): Observable<Balance>
  {
    return this.http.get<Balance>(`${environment.apiURL}/Balance/${this.id}`);
  }
}
