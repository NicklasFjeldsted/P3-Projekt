import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from "moment";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationResponse } from '../interfaces/AuthenticationResponse';

const TOKEN_KEY = 'auth-token';
const TOKEN_EXP = 'auth-token-exp';
const URL = 'http://10.0.6.2/api/Customers/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  constructor(private http: HttpClient, private jwt: JwtHelperService, private router: Router) { }

  // Authenticates the given credentials.
  public authenticate(email: string, password: string): void
  {
    // Returns the JWT access token.
    const responseObservable: Observable<string> = this.http.post<string>(URL, { email, password });

    // Call the setSession function and pass in the JWT token from the response.
    responseObservable.subscribe(JWT => this.setSession);
  }

  // Sets a token to session storage and sets the expiration date of the token.
  private setSession(token: string): void
  {
    // Check if the token is there.
    if (!token) alert("error");

    // Get the expiration moment.
    const expiresAt = moment().add(this.jwt.getTokenExpirationDate()?.getMilliseconds(), 'second');
    console.log(expiresAt);

    // Set the tokens in the session storage.
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXP, JSON.stringify(expiresAt.valueOf()));
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

  // Remove the access token.
  public removeJwtToken(): void
  {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  // Get the access token.
  public getToken(): string
  {
    return sessionStorage.getItem(TOKEN_KEY)!;
  }

  canActivate(): boolean
  {
	  const token = sessionStorage.getItem("token");

    if (token != null && !this.isExpired())
    {
			return true;
    }

		this.router.navigate(["login"]);
		return false;
	}


}
