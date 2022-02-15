import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Customer } from './interfaces/customer';

@Injectable({providedIn: 'root'})
export class ApiService {
  constructor(private http: HttpClient) { }

  getCustomer(email: string | undefined): Observable<Customer[]>
  {
    let url = "http://10.0.6.2/api/Customer/GetCustomer?email=" + email;
    return this.http.get<Customer[]>(url);
  }
}
