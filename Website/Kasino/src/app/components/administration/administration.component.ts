import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { User } from "src/app/interfaces/User";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CustomerService } from "src/app/services/customer.service";
import { DialogConfig, DialogService } from "../modals/dialog.service";
import { EditBalanceComponent } from "../modals/action-modals/edit-balance/edit-balance.component";
import { EditUserComponent } from "../modals/action-modals/edit-user/edit-user.component";
import { DeactivateUserComponent } from "../modals/action-modals/deactivate-user/deactivate-user.component";

@Component({
  selector: "app-administration",
  templateUrl: "./administration.component.html",
  styleUrls: ["./administration.component.css"],
})
export class AdministrationComponent {
  displayedColumns: string[] = ["id", "email", "firstname", "lastname", "role", "actions"];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private customerService: CustomerService, private authenticationService: AuthenticationService, private dialog: DialogService) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngAfterViewInit() {
    this.authenticationService.OnTokenChanged.subscribe((token) => {
      if (token !== "") { // Checks if logged in
        this.customerService.getAll().subscribe((customers) => {
          this.dataSource = new MatTableDataSource<User>(customers); // new Datasource instance
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  // Filter used on searchbar
  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // Switchcase function, opens associated action modals
  openAction(customerID: number, id: number) {
    let dialogConfig: DialogConfig = { data: customerID };
    switch (id) {
      case 1:
        this.dialog.open(EditUserComponent, dialogConfig);
        break;
      case 2:
        this.dialog.open(EditBalanceComponent, dialogConfig);
        break;
      case 3:
        this.dialog.open(DeactivateUserComponent, dialogConfig);
        break;
      case 4:
        this.resetPassword();
        break;
    }
  }

  resetPassword() {}
}
