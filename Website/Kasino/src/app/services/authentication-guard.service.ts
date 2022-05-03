import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, pipe } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate
{
  constructor(private router: Router, private authenticationService: AuthenticationService) { }
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    return this.authenticationService.isLoggedIn.then((x) =>
    {
      if (!x)
      {
        return this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return true;
    })
    // if (this.authenticationService.Validate())
    // {
    //   return true;
    // }
    // else
    // {
    //   return this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // }
  }
}
