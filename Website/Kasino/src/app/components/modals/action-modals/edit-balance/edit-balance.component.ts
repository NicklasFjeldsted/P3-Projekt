import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
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

  customerBalance: Balance;

  displayedColumns: string[] = ["transaction-id", "customer-id", "date", "amount", "balance"];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: number,
    private balanceService: BalanceService,
    private transactionService: TransactionService
  ) {
    this.customerID = data;
  }

  ngOnInit() {
    this.getUserTransactions();
  }

  // Gets user balance from database
  getUserBalance(): void {
    this.balanceService.getUserBalance(this.customerID).subscribe({
      next: (customer) => {
        this.customerBalance = customer;
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
}
