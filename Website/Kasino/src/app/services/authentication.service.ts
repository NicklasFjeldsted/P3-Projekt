import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from "moment";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationResponse } from '../interfaces/AuthenticationResponse';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'auth-token';
const TOKEN_EXP = 'auth-token-exp';
const URL =  environment.apiURL + 'Customers/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate
{
  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private router: Router
  ) { }

  // Authenticates the given credentials.
  public authenticate(email: string, password: string): void
  {
    // Returns the JWT access token.
    const responseObservable: Observable<AuthenticationResponse> = this.http.post<AuthenticationResponse>(URL, { email, password }, { withCredentials: true });

    // Call the setSession function and pass in the JWT token from the response.
    responseObservable.subscribe(authenticationResponse =>
    {
      this.setSession(authenticationResponse.jwtToken);
      if (this.isLoggedIn())
      {
        this.router.navigate(['/']);
      }
    });
  }

  // Sets a token to session storage and sets the expiration date of the token.
  private setSession(token: string): void
  {
    // Check if the token is there.
    if (!token) alert("error");

    // Get the expiration moment.
    const expiresAt = moment().add(this.jwt.getTokenExpirationDate()?.getMilliseconds(), 'second');

    // Set the tokens in the session storage.
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXP, JSON.stringify(expiresAt.valueOf()));
  }

  // Check if the access token is expired.
  public isExpired(): boolean
  {
    return moment().isBefore(this.getExpiration());
  }

  // Gets the expiration token expiration moment.
  private getExpiration(): moment.Moment
  {
    // Gets the expiration.
    const expiration: string = sessionStorage.getItem(TOKEN_EXP)!;

    // Converts it to a moment.
    const expiresAt: moment.MomentInput = JSON.parse(expiration);

    // Return it.
    return moment(expiresAt);
  }

  // Remove the access token.
  private clearSession(): void
  {
    sessionStorage.clear();
  }

  public logOut(): void
  {
    this.http.post<any>(environment.apiURL + 'customers/revoke-token', { Token: null }, { withCredentials: true }).subscribe(e =>
    {
      this.router.navigate(['/']);
      this.clearSession();
    });
  }

  // Get the access token.
  public getToken(): string
  {
    return sessionStorage.getItem(TOKEN_KEY)!;
  }

  public refreshToken(): void
  {
    this.http.post<any>(environment.apiURL + 'customers/refresh-token', null).subscribe(e => console.log(e));
  }

  public canActivate(): boolean
  {
	  const token = sessionStorage.getItem(TOKEN_KEY);

    if (token != null && !this.isExpired())
    {
			return true;
    }

		this.router.navigate(["login"]);
		return false;
	}

  public isLoggedIn(): boolean
  {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token != null && !this.isExpired())
    {
			return true;
    }
    else
    {
      return false;
    }
  }
}
