import { AuthenticationService } from "../services/authentication.service";
import { DataService } from "../services/data.service";

export function appInitializer(authenticationService: AuthenticationService, dataService: DataService)
{
  return () => new Promise(resolve =>
  {
    // attempt to refresh token on app start up to auto authenticate
    if(localStorage.getItem('countries') === null)
    {
      dataService.GetCountries().subscribe(e => { localStorage.setItem('countries', JSON.stringify(e)); });
    }
    authenticationService.refreshToken().subscribe().add(resolve(true));
  });
}
