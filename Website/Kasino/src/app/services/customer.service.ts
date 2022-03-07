import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { mapTo, Observable, pipe, take } from 'rxjs';
import { CustomerRegisterRequest } from '../interfaces/CustomerRegisterRequest';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class CustomerService
{
  constructor(private http: HttpClient, private authenticationService: AuthenticationService, private router: Router) { }

  // Works
  public authenticate(credentials: any): void
  {
    this.authenticationService.authenticate(credentials.email, credentials.password);
  }

  // Might work
  public register(data: any): Observable<any>
  {
    return this.http.post<any>(environment.apiURL + 'customers/register', data);
  }

  // Doesnt work
  public refreshToken(): void
  {
    this.authenticationService.refreshToken();
  }

  // Doesnt work
  public getRefreshTokens(): void
  {
    this.http.get<any>(environment.apiURL + 3 + 'customers/refresh-tokens').subscribe(e => console.log(e));
  }

  public isLoggedIn(): boolean
  { 
    return this.authenticationService.isLoggedIn();
  }

  public logOut(): void
  {
    this.authenticationService.clearSession();
    this.router.navigate(['login']);
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
