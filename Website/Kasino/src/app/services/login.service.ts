import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://localhost:5001/api/Auth/';
const headers = new HttpHeaders().set('Content-Type', 'application/json');

const baseURL = '';

@Injectable({
  providedIn: 'root'
})

export class LoginService
{
  constructor(private http: HttpClient) { }
  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'Login',
    { email: credentials.email, password: credentials.password },
    { headers, responseType: 'text'})
  }
  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'Login',
    { email: user.email, password: user.password },
    { headers, responseType: 'text'})
  }
}
