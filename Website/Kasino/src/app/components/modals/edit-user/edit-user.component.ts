import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject, OnInit } from "@angular/core";
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

  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }

  getUser() {
    this.customerService.getCustomer(this.customerID).subscribe({
      next: (customer) => {
        this.customerAcc = customer;
      },
    });
  }

  addActive(id: number): void {
    const nav = document.getElementById("navbar")!.children;
    this.site = id;

    for (let i = 0; i < 4; i++) {
      if (nav[i].classList.contains("active")) {
        nav[i].classList.remove("active");
      }
    }
    nav[id].classList.add("active");
  }
}
