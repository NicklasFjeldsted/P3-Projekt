import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  form: FormGroup;
  submitted = false;
  returnUrl: string;
  show: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.authenticationService.OnTokenChanged.subscribe((token) => {
      if (token !== "") {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  public onSubmit(): void {
    this.authenticationService
      .login(this.f["email"].value, this.f["password"].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: () => {
          this.submitted = true;
          this.form.markAsUntouched();
        },
      });
  }

  togglePassword = () => (this.show = !this.show);
}
