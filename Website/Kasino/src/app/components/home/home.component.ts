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
  category: number = 0;

  constructor(private customerService: CustomerService) { }

  ngOnInit() { }

  addActive(id: number): void 
  {
    const nav = document.getElementById("navbar")!.children;
    this.category = id;
    
    for(let i = 0; i < 3; i++) 
    {
      if(nav[i].classList.contains('active')) {
        nav[i].classList.remove('active');
      }
    }
    nav[id].classList.add('active');
  }
}