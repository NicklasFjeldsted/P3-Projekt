import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public GetCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.apiURL}/data/Countries`);
  }

}
