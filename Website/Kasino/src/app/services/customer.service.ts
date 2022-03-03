import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { mapTo, Observable, pipe, take } from 'rxjs';
import { CustomerRegisterRequest } from '../interfaces/CustomerRegisterRequest';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class CustomerService
{
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  // Works
  public authenticate(credentials: any): void
  {
    this.authenticationService.authenticate(credentials.email, credentials.password);
  }

  // Works
  public deauthenticate(): void
  {
  }

  // Might work
  public register(data: CustomerRegisterRequest): Observable<CustomerRegisterRequest>
  {
    return this.http.post<CustomerRegisterRequest>(environment.apiURL + 'customers/register', data);
  }

  // Doesnt work
  public refreshToken(): void
  {
    this.http.post<any>(environment.apiURL + 'customers/refresh-token', null).subscribe(e => console.log(e));
  }

  // Doesnt work
  public getRefreshTokens(): void
  {
    this.http.get<any>(environment.apiURL + 3 + 'customers/refresh-tokens').subscribe(e => console.log(e));
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
