import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRegisterRequest } from '../interfaces/CustomerRegisterRequest';

const URL = 'http://10.0.6.2/api/Auth/';

const headers = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root'
})

export class CustomerService
{
  constructor(private http: HttpClient) { }

  public login(credentials: any): Observable<any>
  {
    return this.http.post(URL + 'Login',
    { email: credentials.email, password: credentials.password },
    { headers, responseType: 'text'});
  }

  public register(data: CustomerRegisterRequest): Observable<CustomerRegisterRequest>
  {
    return this.http.post<CustomerRegisterRequest>(URL + 'Login', data);
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
