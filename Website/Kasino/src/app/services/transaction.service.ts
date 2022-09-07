import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Transaction } from "../interfaces/transaction";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  // Creates a transaction
  public AddTransaction(body: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/transaction/create`, body, { withCredentials: true });
  }

  // Gets all transactions with the associated id
  public getAllById(id: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${environment.apiURL}/transaction/${id}`);
  }
}
