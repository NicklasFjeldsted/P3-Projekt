import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { User } from "src/app/interfaces/User";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CustomerService } from "src/app/services/customer.service";
import { DialogConfig, DialogService } from "../modals/dialog.service";
import { EditUserComponent } from "../modals/edit-user/edit-user.component";

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
      if (token !== "") {
        this.customerService.getAll().subscribe((customers) => {
          this.dataSource = new MatTableDataSource<User>(customers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openEdit(customer: any) {
    let dialogConfig: DialogConfig = {
      data: customer.customerID,
    };
    this.dialog.open(EditUserComponent, dialogConfig);
  }

  openDeactive() {
    // this.dialog.open();
  }
}
