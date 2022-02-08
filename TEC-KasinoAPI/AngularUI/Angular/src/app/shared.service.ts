import { Injectable, Inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable, observable} from 'rxjs';

@Injectable()
export class SharedService {
  myAppUrl: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
  }
}
