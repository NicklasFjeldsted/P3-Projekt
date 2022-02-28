import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptorInterceptor implements HttpInterceptor
{
  constructor(private authenticationService: AuthenticationService) {}

  // Intercept any HTTP Request and set the access token in the header if it is there.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // Get the token.
    const token = this.authenticationService.getToken();

    // Check if the token is there and if it is expired.
    if (token && !this.authenticationService.isExpired())
    {
      // Clone the request and insert the token into it.
      const cloned = request.clone(
        {
          headers: request.headers.set("Authorization",
            "bearer " + token)
        }
      );
      // Continue the HTTP Request modifed with the access token.
      return next.handle(cloned);
    }
    else
    {
      // Continue the HTTP Request unmodified.
      return next.handle(request);
    }


  }
}
