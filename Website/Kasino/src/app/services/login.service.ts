import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseURL = '';

@Injectable({
  providedIn: 'root'
})
export class LoginService
{
  constructor(private httpClient: HttpClient) { }

  get(data: any)
  {

  }
}
