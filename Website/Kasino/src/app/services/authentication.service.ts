import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { Balance } from '../interfaces/balance';
import { AccountInfo } from '../interfaces/accountInfo';

@Injectable({ providedIn: 'root' })
export class AuthenticationService
{
  public accessTokenSubject: BehaviorSubject<string>;
  public OnTokenChanged: Observable<string>;

  constructor(private http: HttpClient, private router: Router)
  {
    this.accessTokenSubject = new BehaviorSubject<string>('');
    this.OnTokenChanged = this.accessTokenSubject.asObservable();
  }

  /** Gets the current value of the access token string. Returns <empty string> if there is no token. */
  public get accessToken(): string
  {
    return this.accessTokenSubject.value;
  }

  public login(email: string, password: string): Observable<User>
  {
    return this.http.post<User>(`${environment.apiURL}/Customers/authenticate`, { email, password }, { withCredentials: true })
      .pipe(map(user =>
      {
        localStorage.setItem(environment.USER_ID, JSON.stringify(user.id));
        this.accessTokenSubject.next(user.jwtToken!);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  public logout(): void
  {
    this.http.post<any>(`${environment.apiURL}/Customers/revoke-token`, {}, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    this.accessTokenSubject.next('');
    this.router.navigate(['/login']);
  }

  public refreshToken(): Observable<any>
  {
    return this.http.post<any>(`${environment.apiURL}/Customers/refresh-token`, {}, { withCredentials: true })
      .pipe(map(response => {
        this.accessTokenSubject.next(response.jwtToken);
        this.startRefreshTokenTimer();
      }));
  }

  // helper methods
  private refreshTokenTimeout: any;

  private startRefreshTokenTimer(): void
  {
    // parse json object from base64 encoded jwt token
    //const jwtToken = JSON.parse(atob(this.accessToken.split('.')[ 1 ]));

    // set a timeout to refresh the token a minute before it expires
    //const expires = new Date(jwtToken.exp * 1000);
    //const timeout = expires.getTime() - Date.now() - (60 * 1000);
    //this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void
  {
    clearTimeout(this.refreshTokenTimeout);
  }

  public decodeToken(): Observable<Balance>
  {
    let id = JSON.parse(localStorage.getItem(environment.USER_ID)!);
    return this.http.get<Balance>(`${environment.apiURL}/Balance/${id}`);
  }

  public getAccount(): Observable<AccountInfo> {
    let id = JSON.parse(localStorage.getItem(environment.USER_ID)!);
    return this.http.get<AccountInfo>(`${environment.apiURL}/Customers/${id}`);
  }
}
