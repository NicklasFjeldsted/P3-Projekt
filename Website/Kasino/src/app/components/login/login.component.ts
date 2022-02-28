import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent {
  constructor(private router: Router, private customerService: CustomerService) { }

  invalidLogin: boolean = false;

  loginCredentials(form: NgForm)
  {
    const credentials = {
      "email": form.value.email,
      "password": form.value.password
    }

    this.customerService.login(credentials)
      .subscribe({
        next: (res) => {
          const token = res;
          this.invalidLogin = false;
          this.router.navigate([""]);
        },
        error: (err) => {
          this.invalidLogin = true;
        }
      })
  }}
