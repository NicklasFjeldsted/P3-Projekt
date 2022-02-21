import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent {
  constructor(private router: Router, private loginService: LoginService) { }
  invalidLogin: boolean = false;
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
