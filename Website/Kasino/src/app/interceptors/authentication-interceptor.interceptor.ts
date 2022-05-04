import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthenticationInterceptorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService)
  {
    this.authenticationService.OnTokenChanged.subscribe((token) =>
    {
      if (token !== '')
      {
        this.isLoggedIn = true;
      }
      else
      {
        this.isLoggedIn = false;
      }
    });
  }

  private isLoggedIn: boolean = false;

  // Intercept any HTTP Request and set the access token in the header if it is there.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // Add auth header with jwt if user is logged in and request is to the api url
    const accessToken = this.authenticationService.accessToken;
    const isApiUrl = request.url.startsWith(environment.apiURL);
    if (this.isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return next.handle(request);
  }
}
