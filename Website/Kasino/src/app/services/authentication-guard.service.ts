import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate
{
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    const user = this.authenticationService.userValue;
    if (user)
    {
        // logged in so return true
        return true;
    }
    else
    {
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
  }
}
