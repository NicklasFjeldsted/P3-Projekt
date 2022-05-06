import { animate, state, style, transition, trigger } from "@angular/animations";
import { _isNumberValue } from "@angular/cdk/coercion";
import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, Form, FormControl, FormGroup } from "@angular/forms";
import { Country } from "src/app/interfaces/country";
import { UserAccount } from "src/app/interfaces/UserAccount";
import { CustomerService } from "src/app/services/customer.service";
import { DialogRef } from "../dialog-ref";
import { DIALOG_DATA } from "../dialog-tokens";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          opacity: 1,
        })
      ),

      state(
        "closed",
        style({
          opacity: 0,
        })
      ),
      transition("* => *", animate(400)),
    ]),
  ],
})
export class EditUserComponent implements OnInit {
  isOpen: boolean = true;
  site: number;
  customerID: number;
  customerAcc: UserAccount;

  customerForm: FormGroup = new FormGroup({
    customerID: new FormControl(),
    email: new FormControl(""),
    countryID: new FormControl(),
    phoneNumber: new FormControl(""),
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    address: new FormControl(""),
    zipCodeID: new FormControl(),
    genderID: new FormControl(),
    registerDate: new FormControl(""),
  });

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: number, private customerService: CustomerService) {
    this.customerID = data;
    this.customerAcc = {
      customerID: null,
      email: null,
      countryID: null,
      phoneNumber: null,
      firstName: null,
      lastName: null,
      address: null,
      zipCodeID: null,
      genderID: null,
      registerDate: null,
    };
  }

  ngOnInit() {
    this.addActive(0);
    this.getUser();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }

  // Gets user from database
  getUser(): void {
    this.customerService.getCustomer(this.customerID).subscribe({
      next: (customer) => {
        this.customerAcc = customer;
        this.assignForm();
      },
      error: () => {
        console.log(`Could not find customer! ${this.customerID}`);
      },
    });
  }

  // Converts countryName to CountryID and vice versa
  convertCountry(countryID?: number | null, countryName?: string): string | number {
    const countries: Country[] = JSON.parse(localStorage.getItem("countries")!);
    if (countryID != null) {
      const country: Country | undefined = countries.find((country) => country.countryID == countryID);
      return country!.countryName;
    } else {
      const country: Country | undefined = countries.find((country) => country.countryName == countryName);
      return country!.countryID;
    }
  }

  convertGender = (inputVal: string | number) => (_isNumberValue(inputVal) ? (inputVal == 1 ? "Male" : "Female") : inputVal === "Male" ? 1 : 2);

  // Adds active class to selected navbar item
  addActive(siteNumber: number): void {
    const nav = document.getElementById("navbar")!.children;
    this.site = siteNumber;
    for (let i = 0; i < 3; i++) {
      if (nav[i].classList.contains("active")) {
        nav[i].classList.remove("active");
      }
    }
    nav[siteNumber].classList.add("active");
  }

  // Assigns data to the form
  assignForm(): void {
    this.customerForm.setValue({
      customerID: this.customerAcc.customerID,
      email: this.customerAcc.email,
      countryID: this.convertCountry(this.customerAcc.countryID),
      phoneNumber: this.customerAcc.phoneNumber,
      firstName: this.customerAcc.firstName,
      lastName: this.customerAcc.lastName,
      address: this.customerAcc.address,
      zipCodeID: this.customerAcc.zipCodeID,
      genderID: this.convertGender(this.customerAcc.genderID!),
      registerDate: new Date(this.customerAcc.registerDate!).toLocaleString("en-GB", { timeZone: "CET" }), // Formats string to DD/MM/YY in CET timezone
    });
    this.customerForm.markAsPristine();
  }

  // Closes modal
  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }
}
