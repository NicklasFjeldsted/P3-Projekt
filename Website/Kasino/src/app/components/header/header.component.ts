import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit
{

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void { }

  public logOut(): void
  {
    this.customerService.deauthenticate();
  }

}
