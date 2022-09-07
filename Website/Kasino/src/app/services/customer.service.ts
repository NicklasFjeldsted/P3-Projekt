import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User, UserData } from "../interfaces/User";
import { CustomerRegisterRequest } from "../interfaces/CustomerRegisterRequest";
import { ContactMail } from "../interfaces/ContactMail";
import { UserAccount } from "../interfaces/UserAccount";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private UserSubject: BehaviorSubject<UserData>;
  public OnUserDataChanged: Observable<UserData>;

  constructor(private http: HttpClient) {
    this.UserSubject = new BehaviorSubject<UserData>(new UserData());
    this.OnUserDataChanged = this.UserSubject.asObservable();
  }

  /** Get all customers. */
  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiURL}/Customers`);
  }

  /** Get the logged in customer. */
  public getCustomer(id: number): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${environment.apiURL}/Customers/${id}`);
  }

  public updateCustomer(body: UserAccount): Observable<any> {
    return this.http.put<any>(`${environment.apiURL}/Customers/${body.customerID}`, body, { withCredentials: true });
  }

  /** Returns the user data of the logged in user. */
  public getUser(): void {
    this.http.get<UserData>(environment.apiURL + "/game/GetUser").subscribe((userData) => this.UserSubject.next(userData));
  }

  /** Post customer credentials. */
  public register(body: CustomerRegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/Customers/register`, body, { withCredentials: true });
  }

  /** Post mails content. */
  public sendMail(mail: ContactMail): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/Data/SendEmail`, mail);
  }
}

/*
{
  "email": "alexanderv.eriksen@gmail.com",
  "password": "Passw0rd",
  "countryID": 45,
  "phoneNumber": 40306827,
  "cprNumber": "2308011111",
  "firstName": "Alexander",
  "lastName": "Eriksen",
  "address": "Auderød Byvej 12",
  "zipCodeID": 3300,
  "genderID": 1
}
*/
