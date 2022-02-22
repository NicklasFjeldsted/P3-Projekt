import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent {
  constructor(private router: Router, private loginService: LoginService) { }

  invalidLogin: boolean = false;

  loginCredentials(form: NgForm)
  {
    const credentials = {
      "email": form.value.email,
      "password": form.value.password
    }

    this.loginService.login(credentials)
      .subscribe({
        next: (res) => {
          const token = res;
          localStorage.setItem("token", token);
          this.invalidLogin = false;
          this.router.navigate([""]);
        },
        error: (err) => {
          this.invalidLogin = true;
        }
      })
  }}
