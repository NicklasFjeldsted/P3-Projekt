import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent   {
  invalidLogin = true;
  constructor(private router: Router, private http: HttpClient, private loginService: LoginService) { }
  login(form: NgForm) {
    const credentials = {
      "email": form.value.email,
      "password": form.value.password
    }

    this.loginService.login(credentials).subscribe(response => {
      const token = (<any>response).token;
      localStorage.setItem("jwt", token);
      this.invalidLogin = false;
      this.router.navigate(["/"]);
    }, err => {
      this.invalidLogin = true;
    })
  }

}
