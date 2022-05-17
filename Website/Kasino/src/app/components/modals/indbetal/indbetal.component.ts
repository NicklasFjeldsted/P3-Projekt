import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ChangeBalance } from "src/app/interfaces/changeBalance";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BalanceService } from "src/app/services/balance.service";
import { TransactionService } from "src/app/services/transaction.service";
import { KontoComponent } from "../../konto/konto.component";
import { DialogRef } from "../dialog-ref";
import { DIALOG_DATA } from "../dialog-tokens";
import { DialogService } from "../dialog.service";

@Component({
  selector: "app-indbetal",
  templateUrl: "./indbetal.component.html",
  styleUrls: ["./indbetal.component.css"],
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
export class IndbetalComponent implements OnInit, OnDestroy {
  isOpen: boolean = true;
  isCardValid: boolean = true;
  currentLimit: number | null;
  form: FormGroup;

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: string,
    public authenticationService: AuthenticationService,
    private router: Router,
    private builder: FormBuilder,
    private balanceService: BalanceService,
    private transaction: TransactionService
  ) {}

  ngOnInit(): void {
    this.isOpen = true;
    this.getDepositLimit();
    document.body.classList.add("modalOpen");

    // Gives form validators
    this.form = this.builder.group({
      cardName: ["", Validators.required],
      cardNumber: ["", [Validators.required, Validators.minLength(19), Validators.maxLength(19)]],
      expDate: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      amount: [null, Validators.required],
    });
    this.updateAmount(100, 0);
    this.f["amount"].markAsUntouched();
  }
  ngOnDestroy(): void {
    document.body.classList.remove("modalOpen");
  }

  // Gets max length of amount based on their deposit limit
  getMaxLength = () => this.currentLimit?.toString().length!;

  // Gets controls from form
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Submits the deposit request
  onSubmit(): void {
    this.balanceService.addBalance(this.f["amount"]?.value).subscribe({
      next: (response) => {
        this.transaction.AddTransaction(response).subscribe(() => {
          this.close();
          this.balanceService.updateBalance();
        });
      },
      error: (error) => {
        console.log("Something went wrong! ", error);
      },
    });
  }

  getDepositLimit(): void {
    this.authenticationService.decodeToken().subscribe({
      next: (userBalance) => {
        this.currentLimit = userBalance.depositLimit;
      },
      error: (error) => {
        console.log("Something went wrong! ", error);
      },
    });
  }

  // Updates the amount value to the specified buttons value
  updateAmount(value: number, id: number): void {
    this.f["amount"].markAsTouched();
    this.form.patchValue({ amount: value });
    const element = document.getElementById("button-grid")!.children;
    for (let i = 0; i < element?.length!; i++) {
      element[i].classList.remove("active");
    }
    element[id].classList.add("active");
  }

  // Checks if the card number is valid through the use of Luhn algorithm
  isValid() {
    let digits: string = this.f["cardNumber"]?.value.split("-").join("");
    if (/[^0-9-\s]+/.test(digits)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0,
      nDigit = 0,
      bEven = false;
    digits = digits.replace(/\D/g, "");

    for (var n = digits.length - 1; n >= 0; n--) {
      var cDigit = digits.charAt(n),
        nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }
    return nCheck % 10 == 0;
  }

  // Adds dashes in between every fourth digit
  addDashes(): void {
    var ele = this.f["cardNumber"].value;
    if (ele === undefined) {
      return;
    }
    ele = ele.split("-").join("");
    this.form.patchValue({ cardNumber: ele.match(/.{1,4}/g)?.join("-") });
  }

  // Add a slash in between month and year
  addSlash(): void {
    var ele = this.f["expDate"]?.value;
    if (ele === undefined) {
      return;
    }
    ele = ele.split("/").join("");
    this.form.patchValue({ expDate: ele.match(/.{1,2}/g)?.join("/") });
  }

  // Checks if user presses letters instead of digits
  keyPressNumbers(event: any): void {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // Closes dialog(modal)
  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }

  openLimit(): void {
    if (this.router.url != "/konto") {
      this.router.navigate(["konto"]);
    }
    this.balanceService.goToLimit(3);
    this.close();
  }
}
