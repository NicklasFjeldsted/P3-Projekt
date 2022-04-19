import { Injectable, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { CustomerRegisterRequest } from '../interfaces/CustomerRegisterRequest';
import { ContactMail } from '../interfaces/ContactMail';

@Injectable({
  providedIn: 'root'
})

export class CustomerService
{
  constructor(private http: HttpClient) { }

  // Gets all customers
  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiURL}/Customers`);
  }

  // Post customer credentials
  public register(body: CustomerRegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/Customers/register`, body, { withCredentials: true });
  }

  // Post mails content
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
