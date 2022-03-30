import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, take } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate
{
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    return this.authenticationService.refreshToken()
      .pipe(map(user => {
        let result: boolean = user.jwtToken == null ? false : true;
        return result;
    }),
    catchError(error => {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      throw new Error(error);
    }))

    //if (this.authenticationService.isLoggedIn)
    //{
    //  // logged in so return true
    //  return true;
    //}
    //else
    //{
    //  // not logged in so redirect to login page with the return url
    //  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //  return false;
    //}
  }
}
