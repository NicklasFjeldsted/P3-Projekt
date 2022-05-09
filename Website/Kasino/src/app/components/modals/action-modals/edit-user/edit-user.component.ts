import { animate, state, style, transition, trigger } from "@angular/animations";
import { _isNumberValue } from "@angular/cdk/coercion";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, Form, FormControl, FormGroup, Validators } from "@angular/forms";
import { Country } from "src/app/interfaces/country";
import { UserAccount } from "src/app/interfaces/UserAccount";
import { CustomerService } from "src/app/services/customer.service";
import { BalanceService } from "src/app/services/balance.service";
import { Balance } from "src/app/interfaces/balance";
import { MatTableDataSource } from "@angular/material/table";
import { Transaction } from "src/app/interfaces/transaction";
import { TransactionService } from "src/app/services/transaction.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { DIALOG_DATA } from "../../dialog-tokens";
import { DialogRef } from "../../dialog-ref";

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
  hasSubmitted: boolean = false;

  customerID: number;
  customerAcc: UserAccount;
  customerBalance: Balance;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  customerForm: FormGroup = new FormGroup({
    customerID: new FormControl(null, Validators.required),
    email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    countryID: new FormControl("", Validators.required),
    phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    genderID: new FormControl(null, Validators.required),
    zipCodeID: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    registerDate: new FormControl("", Validators.required),
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
    this.getUser();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }

  // Submits modified form
  onSubmit(): void {
    this.hasSubmitted = true;
    if (this.customerForm.invalid || !this.customerForm.dirty) return;

    this.customerForm.patchValue({
      // Converts the values back to their original type
      countryID: this.convertCountry(this.f["countryID"].value),
      phoneNumber: parseInt(this.f["phoneNumber"].value),
      genderID: this.convertGender(this.f["genderID"].value),
      registerDate: this.customerAcc.registerDate,
    });

    this.customerService.updateCustomer(this.customerForm.value).subscribe({
      next: (response) => {
        alert(response.message);
        this.close();
      },
      error: (msg: Error) => {
        console.log("Error updating customer: " + msg);
      },
    });
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
  convertCountry(inputVal: string | number): string | number {
    const countries: Country[] = JSON.parse(localStorage.getItem("countries")!);
    if (_isNumberValue(inputVal)) {
      const country: Country | undefined = countries.find((country) => country.countryID == inputVal);
      return country!.countryName;
    }
    const country: Country | undefined = countries.find((country) => country.countryName == inputVal);
    return country!.countryID;
  }

  // Converts genderID to genderName and vice versa
  convertGender = (inputVal: string | number) => (_isNumberValue(inputVal) ? (inputVal == 1 ? "Male" : "Female") : inputVal === "Male" ? 1 : 2);

  // Changes timezone of date to CET
  changeTimeZone(date: Date): string {
    return new Date(date).toLocaleString("en-GB", { timeZone: "CET" });
  }

  // Assigns data to the form
  assignForm(): void {
    this.customerForm.setValue({
      customerID: this.customerAcc.customerID,
      email: this.customerAcc.email,
      countryID: this.convertCountry(this.customerAcc.countryID!),
      phoneNumber: this.customerAcc.phoneNumber,
      firstName: this.customerAcc.firstName,
      lastName: this.customerAcc.lastName,
      address: this.customerAcc.address,
      zipCodeID: this.customerAcc.zipCodeID,
      genderID: this.convertGender(this.customerAcc.genderID!),
      registerDate: this.changeTimeZone(this.customerAcc.registerDate!), // Formats string to DD/MM/YY in CET timezone
    });
    this.customerForm.markAsPristine();
  }

  // Closes modal
  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }
}
