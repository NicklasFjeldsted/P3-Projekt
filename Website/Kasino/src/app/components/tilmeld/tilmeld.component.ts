import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
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
export class TilmeldComponent {
  // Creates form with controls
  form: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    countryID: new FormControl("", Validators.required),
    phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
    cprNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    genderID: new FormControl(null, Validators.required),
    zipCodeID: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    acceptTerms: new FormControl(false, Validators.requiredTrue),
  });

  step: any = 1; // Current step on form
  nextSubmit: boolean = false; // checks if client has pressed next on form
  submitted: boolean = false; // checks if client has submitted form
  custom: CustomerRegisterRequest; // customer request model

  constructor(private customerService: CustomerService, private router: Router, private authenticationService: AuthenticationService) {}

  // Gets all controls from Form
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Goes to next step in registration
  goNext(): void {
    this.nextSubmit = true;
    if (this.convertCountry(this.f["countryID"].value) == -1) return;

    this.form.patchValue({ countryID: this.convertCountry(this.f["countryID"].value) });

    if (this.f["email"].invalid || this.f["password"].invalid || this.f["countryID"].invalid || this.f["phoneNumber"].invalid) return;

    this.step += 1;
  }

  // Registration of customer account
  signUp(): void {
    this.submitted = true;

    if (this.form.invalid) return;

    this.custom = Object.assign(this.form.value);
    this.customerService.register(this.custom).subscribe({
      next: () => {
        this.authenticationService.login(this.f["email"].value, this.f["password"].value).subscribe({
          next: () => {
            this.router.navigate([""]);
          },
          error: (error) => {
            console.error(error);
            this.router.navigate(["login"]);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Converts country name to associated id
  convertCountry(countryName: string): number {
    const countries: Country[] = JSON.parse(localStorage.getItem("countries")!);
    const country: Country | undefined = countries.find((country) => country.countryName == countryName);
    if (country === undefined) {
      console.error("Country not found!");
      return -1;
    }
    return country.countryID;
  }

  // Checks whether customer has assigned a value to genderID
  checkGender = () => (this.form.get("genderID")?.value === null ? false : true);

  // Sets the id of the gender
  setGender(genderid: Number): void {
    this.form.patchValue({ genderID: genderid });
    const buttonMale = document.getElementById("gender-button-0")!.children;
    const buttonFemale = document.getElementById("gender-button-1")!.children;
    for (let i = 0; i < 3; i++) {
      if (genderid == 0) {
        buttonMale[i].classList.add("active");
        buttonFemale[i].classList.remove("active");
      } else {
        buttonFemale[i].classList.add("active");
        buttonMale[i].classList.remove("active");
      }
    }
  }
}
