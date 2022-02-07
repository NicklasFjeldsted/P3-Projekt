import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIURL= "https://localhost:7237/api"

  constructor(private http:HttpClient) { }

  getCustomerList():Observable<any[]>{
    return this.http.get<any>(this.APIURL+'/customer');
  }
}
