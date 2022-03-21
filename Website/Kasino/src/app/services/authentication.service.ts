import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/User';
import { Balance } from '../interfaces/balance';
import { HeaderComponent } from '../components/header/header.component';
import { Broadcast } from '../components/header/broadcast';

const USER = 'USER_ID';
@Injectable({ providedIn: 'root' })
export class AuthenticationService
{
  public userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router)
  {
    this.userSubject = new BehaviorSubject<User>(new User());
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User
  {
    return this.userSubject.value;
  }

  public get isLoggedIn(): boolean
  {
    return this.userSubject.value.jwtToken != null;
  }

  public login(email: string, password: string): Observable<User>
  {
    return this.http.post<User>(`${environment.apiURL}/Customers/authenticate`, { email, password }, { withCredentials: true })
      .pipe(map(user =>
      {
        localStorage.setItem(USER, JSON.stringify(user.id));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        Broadcast.Instance.onBalanceChange.next();
        return user;
      }));
  }

  public logout(): void
  {
    this.http.post<any>(`${environment.apiURL}/Customers/revoke-token`, {}, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(new User());
    this.router.navigate(['/login']);
  }

  public refreshToken(): Observable<any>
  {
    return this.http.post<any>(`${environment.apiURL}/Customers/refresh-token`, {}, { withCredentials: true })
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        Broadcast.Instance.onBalanceChange.next();
        return user;
      }));
  }

  // helper methods
  private refreshTokenTimeout: any;

  private startRefreshTokenTimer(): void
  {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken!.split('.')[ 1 ]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void
  {
    clearTimeout(this.refreshTokenTimeout);
  }

  public decodeToken(): Observable<Balance>
  {
    var id = JSON.parse(localStorage.getItem(USER)!);
    return this.http.get<Balance>(`${environment.apiURL}/Balance/${id}`);
  }
}
