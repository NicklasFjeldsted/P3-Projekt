import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as moment from "moment";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthenticationResponse } from '../interfaces/AuthenticationResponse';

const TOKEN_KEY = 'auth-token';
const TOKEN_EXP = 'auth-token-exp';
const URL = 'http://10.0.6.2/api/Customers/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private router: Router
  ) { }

  // Authenticates the given credentials.
  public authenticate(email: string, password: string): void
  {
    this.http.post<AuthenticationResponse>(URL, { email, password }, { params: { responseType: 'text' } })
    .subscribe(
      {
        next: value => { this.setSession(value.jwtToken); },
        error: error => { console.error(error); },
        complete: () => { this.router.navigate(['/']); }
      }
    );
  }

  // Sets a token to session storage and sets the expiration date of the token.
  private setSession(token: string): boolean
  {
    // Check if the token is there.
    if (!token)
    {
      alert("No token!");
      return false;
    }

    // Get the expiration moment.
    const expiresAt = moment().add(this.jwt.getTokenExpirationDate()?.getMilliseconds(), 'second');

    // Set the tokens in the session storage.
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXP, JSON.stringify(expiresAt.valueOf()));
    return true;
  }

  // Check if we are logged in
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

  // Remove the I.E. Log out.
  public deauthenticate(): void
  {
    sessionStorage.clear();
  }

  // Get the access token.
  public getToken(): string
  {
    return sessionStorage.getItem(TOKEN_KEY)!;
  }

  canActivate(): boolean
  {
		const token = sessionStorage.getItem(TOKEN_KEY);

    if (token != null && !this.isExpired())
    {
			return true;
    }

		this.router.navigate(["login"]);
		return false;
	}
}
