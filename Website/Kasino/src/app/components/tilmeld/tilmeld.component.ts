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
    email: new FormControl('asd@asd.com', [Validators.required, Validators.email]),
    password: new FormControl('Passw0rd', Validators.required),
    countryID: new FormControl('45', Validators.required),
    phoneNumber: new FormControl('12345678', Validators.required),
    cprNumber: new FormControl('1234567890', Validators.required),
    firstName: new FormControl('Nicklas', Validators.required),
    lastName: new FormControl('Fjeldsted', Validators.required),
    address: new FormControl('Brøndbyvestervej 17, 2th', Validators.required),
    zipCodeID: new FormControl('2600', Validators.required),
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
