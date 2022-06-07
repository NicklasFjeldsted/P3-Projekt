import { Component, HostListener, OnInit } from "@angular/core";
import { GameType } from "src/app/game-engine";
import { User } from "src/app/interfaces/User";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  loading = false;
  users: User[];
  category: number = 0;

  constructor() {}

  @HostListener("window:scroll", []) onWindowScroll() {
    // do some stuff here when the window is scrolled
    const verticalOffset = window.pageYOffset;
    if (verticalOffset >= 408) {
      document.getElementById("navbar")?.classList.add("sticky-navbar");
    } else {
      document.getElementById("navbar")?.classList.remove("sticky-navbar");
    }
  }

  // Adds active class to element
  addActive(id: number): void {
    const nav = document.getElementById("navbar")!.children;
    this.category = id;

    for (let i = 0; i < 3; i++) {
      if (nav[i].classList.contains("active")) {
        nav[i].classList.remove("active");
      }
    }
    nav[id].classList.add("active");
  }
}
