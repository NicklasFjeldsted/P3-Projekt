import { Component, OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerRegisterRequest } from 'src/app/interfaces/CustomerRegisterRequest';

@Component({
  selector: 'app-tilmeld',
  templateUrl: './tilmeld.component.html',
  styleUrls: ['./tilmeld.component.css']
})

export class TilmeldComponent implements OnInit {

  // Creates form
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    countryID: new FormControl(''),
    phoneNumber: new FormControl(),
    cprNumber: new FormControl(),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormControl(''),
    zipCodeID: new FormControl(),
    genderID: new FormControl(),
    acceptTerms: new FormControl(false),
  });

  step: any = 2; // Current step on form
  nextSubmit: boolean = false; // checks if client has pressed next on form
  acceptRights: boolean = false; // checks if client has accepted their rights
  submitted: boolean = false; // checks if client has submitted form
  custom: CustomerRegisterRequest; // customer request model
  validGender: boolean;

  constructor(private customerService: CustomerService, private router: Router, private formBuilder: FormBuilder) { }

  // Gives form properties validators
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['nicklasfjeldstedosbeck@gmail.com', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      countryID: ['Denmark', Validators.required],
      phoneNumber: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
      cprNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      genderID: [],
      zipCodeID: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
    console.log(this.nextSubmit);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  goNext(): void {
    this.nextSubmit = true;

    if(this.f['email'].invalid || this.f['password'].invalid || this.f['countryID'].invalid || this.f['phoneNumber'].invalid)
      return;
    else {
      this.step += 1;
    }
  }

  signUp(): void {

    this.submitted = true;

    this.checkGender() ? this.validGender = false : this.validGender = true;

    if(this.f['cprNumber'].invalid || this.f['firstName'].invalid || this.f['lastName'].invalid || this.f['address'].invalid || this.f['zipCodeID'].invalid || this.f['acceptTerms'].invalid)
      return;

    this.custom = Object.assign(this.form.value);
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

  checkGender(): number | undefined {
    return this.form.get('genderID')?.value;
  }

  setGender(genderid: Number): void {
    this.form.patchValue({genderID: genderid});
  }
}
