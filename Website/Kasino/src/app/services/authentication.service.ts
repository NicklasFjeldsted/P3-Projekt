import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as moment from "moment";
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'auth-token';
const TOKEN_EXP = 'auth-token-exp';
const URL = 'http://10.0.6.2/api/Customers/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  public authenticate(email: string, password: string): Observable<string>
  {
    return this.http.post<string>(URL, { email, password }).pipe(e => this.setSession())
  }

  private setSession(token: string): void
  {
    const expiresAt = moment().add(this.jwt.getTokenExpirationDate()?.getMilliseconds(), 'second');
    console.log(expiresAt);

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXP, JSON.stringify(expiresAt.valueOf()));
  }

  public isLoggedIn(): boolean
  {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut(): boolean
  {
    return !this.isLoggedIn();
  }

  private getExpiration(): moment.Moment
  {
    const expiration: string = sessionStorage.getItem(TOKEN_EXP)!;
    const expiresAt: moment.MomentInput = JSON.parse(expiration);

    return moment(expiresAt);
  }

  public removeJwtToken(): void
  {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
