import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerRegisterRequest } from 'src/app/interfaces/CustomerRegisterRequest';

@Component({
  selector: 'app-tilmeld',
  templateUrl: './tilmeld.component.html',
  styleUrls: ['./tilmeld.component.css']
})

export class TilmeldComponent {

  step: any = 1;
  wrongcred: any = false;
  custom: CustomerRegisterRequest;

  constructor(private customerService: CustomerService, private router: Router) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    countryID: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    cprNumber: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    zipCodeID: new FormControl('', Validators.required),
    genderID: new FormControl()
  });

  goNext() { this.step += 1; }

  signUp() {
    this.custom = this.form.value;
    this.customerService.register(this.custom).subscribe({
      next: () => {
        let credentials = {email: '', password: ''};
        credentials = Object.assign(credentials, this.form.value)
        this.customerService.authenticate(credentials);
        this.router.navigate([""]);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  setGender(genderid: Number) {
    this.form.patchValue({genderID: genderid});
  }
}
