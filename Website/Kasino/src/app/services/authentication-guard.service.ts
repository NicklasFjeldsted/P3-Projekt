import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, pipe } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate
{
  constructor(private router: Router, private authenticationService: AuthenticationService)
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
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (!this.isLoggedIn)
    {
      return this.router.navigate([ '/login' ], { queryParams: { returnUrl: state.url } });
    }

    return true;
  }
}
