import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  loading = false;
  users: User[];

  constructor(private customerService: CustomerService) { }

  ngOnInit()
  {

  }
}
