import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  animations: [
    trigger("openSidenav", [
      state(
        "open",
        style({
          left: "0",
          opacity: "1",
        })
      ),
      state(
        "closed",
        style({
          left: "-250px",
          opacity: ".3",
        })
      ),
      transition("open => closed", [animate("0.3s ease")]),
      transition("closed => open", [animate("0.3s ease")]),
    ]),
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  isIndbetalOpen = false;

  isSidenavOpen = false;

  sideNav: HTMLElement;
  backDrop: HTMLElement;
  hasVisited = false;

  ngOnInit(): void {
    this.sideNav = document.getElementById("sideNav")!;
    this.backDrop = document.getElementById("backdrop")!;
  }

  closeSideNav(): void {
    if (this.sideNav.classList.contains("active")) {
      this.isSidenavOpen = !this.isSidenavOpen;
      this.sideNav.classList.remove("active");
      this.backDrop.classList.remove("active");
    }
  }

  openSideNav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sideNav.classList.add("active");
    this.backDrop.classList.add("active");
  }

  goToLink(site: string) {
    this.router.navigate([site]);
  }

  onActivate() {
    if (document.getElementsByTagName("app-home").length == 0 || this.hasVisited == true) {
      document.getElementById("component-container")!.style.height = "100%";
    } else if (document.getElementsByTagName("app-home").length != 0) {
      this.hasVisited = true;
      document.getElementById("component-container")!.style.height = "1500px";
    }
  }
}
