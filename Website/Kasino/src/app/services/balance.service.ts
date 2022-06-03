import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ChangeBalance } from "../interfaces/changeBalance";
import { Balance } from "../interfaces/balance";

@Injectable({
  providedIn: "root",
})
export class BalanceService {
  private balance: ChangeBalance;
  private BalanceSubject: BehaviorSubject<Balance>;
  public OnBalanceChanged: Observable<Balance>;

  private Indbetaling: BehaviorSubject<number>;
  public OnIndbetalingChange: Observable<number>;

  constructor(private http: HttpClient) {
    this.BalanceSubject = new BehaviorSubject<Balance>(new Balance());
    this.OnBalanceChanged = this.BalanceSubject.asObservable();

    this.Indbetaling = new BehaviorSubject<number>(1);
    this.OnIndbetalingChange = this.Indbetaling.asObservable();
  }

  private id: number = -1;

  public addBalance(money: number): Observable<any> {
    this.balance = { customerID: this.id, amount: money, isInternal: false };
    return this.http.put<any>(`${environment.apiURL}/balance/add-balance`, this.balance, { withCredentials: true });
  }

  public subtractBalance(money: number): Observable<any> {
    this.balance = { customerID: this.id, amount: money, isInternal: false };
    return this.http.put<any>(`${environment.apiURL}/balance/subtract-balance`, this.balance, { withCredentials: true });
  }

  public updateDeposit(depositLimit: number): Observable<any> {
    let customerID = this.id;
    return this.http.put<any>(`${environment.apiURL}/balance/update`, { customerID, depositLimit }, { withCredentials: true });
  }

  public getBalance(id: number): void {
    this.id = id;
    this.http.get<Balance>(`${environment.apiURL}/Balance/${id}`).subscribe((balance) => this.BalanceSubject.next(balance));
  }

  public getUserBalance(id: number): Observable<Balance> {
    return this.http.get<Balance>(`${environment.apiURL}/Balance/${id}`);
  }

  public updateBalance(): void {
    this.http.get<Balance>(`${environment.apiURL}/Balance/${this.id}`).subscribe((balance) => this.BalanceSubject.next(balance));
  }

  public goToLimit(value: number): void {
    this.Indbetaling.next(value);
  }
}
