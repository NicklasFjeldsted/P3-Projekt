import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CustomerService } from "src/app/services/customer.service";
import { CustomerRegisterRequest } from "src/app/interfaces/CustomerRegisterRequest";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Country } from "src/app/interfaces/country";

@Component({
  selector: "app-tilmeld",
  templateUrl: "./tilmeld.component.html",
  styleUrls: ["./tilmeld.component.css"],
})
export class TilmeldComponent implements OnInit {
  step: number = 1; // Current step on form
  customer: CustomerRegisterRequest; // customer request model
  countryArray: Country[];
  countries: string[];
  form: FormGroup;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.countryArray = JSON.parse(localStorage.getItem("countries")!);
    this.countries = this.getAllCountries();

    this.customer = {
      email: "",
      password: "",
      countryID: 0,
      phoneNumber: 0,
      cprNumber: "",
      firstName: "",
      lastName: "",
      address: "",
      genderID: 0,
      zipCodeID: 0,
    };
  }

  // Initializes the form
  ngOnInit(): void {
    this.form = this.fb.group({
      credentials: this.fb.group({
        email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        password: new FormControl("", [Validators.required, Validators.minLength(8)]),
        countryID: new FormControl("", Validators.required),
        phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
      }),
      details: this.fb.group({
        cprNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        firstName: new FormControl("", Validators.required),
        lastName: new FormControl("", Validators.required),
        address: new FormControl("", Validators.required),
        genderID: new FormControl(null, Validators.required),
        zipCodeID: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      }),
      acceptTerms: new FormControl(false, Validators.requiredTrue),
    });
  }

  // Gets all controls from nested FormGroup
  get credentials() {
    return this.form.controls["credentials"] as FormGroup;
  }

  // Gets all controls from nested FormGroup
  get details() {
    return this.form.controls["details"] as FormGroup;
  }

  // Registration of customer account
  signUp(): void {
    this.credentials.patchValue({ countryID: this.checkCountries()?.countryID });
    this.credentials.controls["email"].value.toLowerCase();
    this.customer = Object.assign(this.customer, this.credentials.value, this.details.value);
    this.customerService.register(this.customer).subscribe({
      next: () => {
        this.authenticationService.login(this.customer.email, this.customer.password).subscribe(() => {
          console.log("You are authorized!");
          this.router.navigate([""]);
        });
      },
      error: (error) => {
        console.log("Something went wrong!", error);
      },
    });
  }

  goNext = () => (this.step += 1); // Goes to next step in registration

  getAllCountries = () => this.countryArray.map((x) => x.countryName); // Gets all country names

  checkCountries = () => this.countryArray.find((country) => country.countryName == this.credentials.controls["countryID"].value); // Finds the country with the associated id

  checkGender = () => (this.details.controls["genderID"].value !== null ? false : true); // Checks if customer has chosen a gender

  // Sets the id of the gender
  setGender(id: Number): void {
    this.details.patchValue({ genderID: id });
    const buttonMale = document.getElementById("gender-button-0")!.children;
    const buttonFemale = document.getElementById("gender-button-1")!.children;
    for (let i = 0; i < 3; i++) {
      if (id == 1) {
        buttonMale[i].classList.add("active");
        buttonFemale[i].classList.remove("active");
      } else {
        buttonFemale[i].classList.add("active");
        buttonMale[i].classList.remove("active");
      }
    }
  }
}
