import { Component, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../services/api-service/api.service';
import { Customer } from '../interfaces/customer';


@Component({
  selector: 'app-api-fetch',
  templateUrl: './api-fetch.component.html',
  styleUrls: ['./api-fetch.component.css']
})

export class APIFetchComponent
{
  customer!: Customer;
  constructor(private api: ApiService)
  {
    this.customer = {
      Email: null,
      PhoneNumber: null,
      Address: null,
      FirstName: null,
      LastName: null,
      CPRNumber: null,
      Password: null,
      ZipCodeID: null,
      CountryID: null,
      GenderID: null,
      RegisterDate: null
    }
  }


  onGet(email: string)
  {
    this.api.getCustomer(email).subscribe((response: Customer[]) => { this.customer = response[ 0 ]; });
  }
}
