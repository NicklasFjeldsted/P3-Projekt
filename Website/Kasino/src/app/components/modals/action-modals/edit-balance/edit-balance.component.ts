import { animate, state, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Balance } from "src/app/interfaces/balance";
import { Transaction } from "src/app/interfaces/transaction";
import { BalanceService } from "src/app/services/balance.service";
import { TransactionService } from "src/app/services/transaction.service";
import { DialogRef } from "../../dialog-ref";
import { DIALOG_DATA } from "../../dialog-tokens";

@Component({
  selector: "app-edit-balance",
  templateUrl: "./edit-balance.component.html",
  styleUrls: ["./edit-balance.component.css"],
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
export class EditBalanceComponent implements OnInit {
  isOpen: boolean = true;
  customerID: number;

  customerBalance: Balance | undefined;
  form: FormGroup;

  newBalance: number;

  displayedColumns: string[] = ["transaction-id", "date", "amount", "current-balance", "isInternal"];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: number,
    private balanceService: BalanceService,
    private transactionService: TransactionService,
    private fb: FormBuilder
  ) {
    this.customerID = data;
  }

  ngOnInit() {
    this.getUserTransactions();
    this.getUserBalance();

    this.form = this.fb.group({
      balanceInput: new FormControl(null, Validators.required),
    });
    var height = document.getElementById("action-panel")!.offsetHeight;
    document.getElementById("action-panel");
  }

  getNewBalance(): void {
    this.newBalance = this.form.controls["balanceInput"].value + this.customerBalance?.balance;
  }

  // Gets user balance from database
  getUserBalance(): void {
    this.balanceService.getUserBalance(this.customerID).subscribe({
      next: (customer) => {
        this.customerBalance = customer;
        this.getNewBalance();
      },
      error: (error) => {
        console.log("Something went wrong! " + error);
      },
    });
  }

  // Gets all customer transactions from database
  getUserTransactions(): void {
    this.transactionService.getAllById(this.customerID).subscribe({
      next: (transactions) => {
        this.dataSource = new MatTableDataSource<Transaction>(transactions);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log("Something went wrong! " + error);
      },
    });
  }

  // Changes timezone of date to CET
  changeTimeZone(date: Date): string {
    return new Date(date).toLocaleString("en-GB", { timeZone: "CET" });
  }

  // Closes modal
  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 45 && charCode != 46 && charCode != 189 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit(): void {
    var value = this.form.controls["balanceInput"].value.toString();
    if (!value.includes("-")) {
      this.balanceService.addBalance(parseInt(value), true).subscribe({
        next: () => {
          console.log("Added balance!");
        },
      });
    } else {
      value = value.split("-").join("");
      this.balanceService.subtractBalance(parseInt(value), true).subscribe({
        next: () => {
          console.log("Removed balance!");
        },
      });
    }
    setTimeout(() => {
      this.getUserTransactions();
    }, 1000);
  }
}
