import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerService } from "src/app/services/customer.service";
import { ContactMail } from "src/app/interfaces/ContactMail";

@Component({
  selector: "app-kontakt",
  templateUrl: "./kontakt.component.html",
  styleUrls: ["./kontakt.component.css"],
})
export class KontaktComponent implements OnInit 
{
  mail: ContactMail;
  form: FormGroup;

  constructor(private builder: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void 
  {
    // Form group
    this.form = this.builder.group({
      Fullname: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required, Validators.email, Validators.pattern("^[A-Za-z-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$")]),
      Subject: new FormControl("", Validators.required),
      Message: new FormControl("", Validators.required),
    });
    this.mail = { Fullname: "", Email: "", Subject: "", Message: "" };
  }

  // Submits the form and sends email
  onSubmit() 
  {
    this.mail = Object.assign(this.mail, this.form.value);
    this.customerService.sendMail(this.mail).subscribe({
      next: () => 
      {
        console.log("Success: Contact form has been sent!");
      },
      error: (error) => 
      {
        console.log("Failed: ", error);
      },
    });
  }
}
