import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRegisterRequest } from '../interfaces/CustomerRegisterRequest';
import { AuthenticationService } from './authentication.service';

const URL = "http://10.0.6.2/api/Customers/";

@Injectable({
  providedIn: 'root'
})

export class CustomerService
{
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  public authenticate(credentials: any): void
  {
    this.authenticationService.authenticate(credentials.email, credentials.password);
  }

  public deauthenticate(): void
  {
    this.authenticationService.deauthenticate();
  }

  public register(data: CustomerRegisterRequest): Observable<CustomerRegisterRequest>
  {
    return this.http.post<CustomerRegisterRequest>(URL + 'register', data);
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
